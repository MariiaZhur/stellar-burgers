import { FC, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loadFeed } from '../../services/slices/feedSlice';
import {
  selectFeedOrders,
  selectFeedLoading,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/selectors';
import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const fetched = useRef(false);

  useEffect(() => {
    if (!fetched.current) {
      dispatch(loadFeed());
      fetched.current = true;
    }
  }, [dispatch]);
  // Достаём из стора список заказов и статус загрузки
  const orders = useAppSelector(selectFeedOrders);
  const loading = useAppSelector(selectFeedLoading);

  // Общая статистика по заказам
  const total = useAppSelector(selectFeedTotal); // всего заказов
  const totalToday = useAppSelector(selectFeedTotalToday); // заказов за сегодня

  // Фильтрация заказов по статусу для вывода в правую колонку
  const readyOrders = orders
    .filter((order) => order.status === 'done') // "Готовы"
    .map((order) => order.number);

  const pendingOrders = orders
    .filter((order) => order.status === 'pending') // "В работе"
    .map((order) => order.number);

  // Загружаем ленту заказов при монтировании страницы
  useEffect(() => {
    dispatch(loadFeed());
  }, [dispatch]);

  // Обновление по кнопке "Обновить"
  const handleGetFeeds = () => {
    dispatch(loadFeed());
  };

  // Показываем прелоадер, если идёт загрузка или нет заказов
  if (loading) return <Preloader />;
  if (!orders.length) return <p>Нет заказов</p>;

  // Отображаем основной UI, передаём готовые данные
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
      feed={{ total, totalToday }} // передаём в Feed
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
