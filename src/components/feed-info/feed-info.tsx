import { FC, useEffect } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loadFeed } from '../../services/slices/feedSlice';
import { Preloader } from '../ui/preloader';

// Функция для извлечения номеров заказов по статусу
const extractOrderNumbers = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .slice(0, 20)
    .map((order) => order.number);

export const FeedInfo: FC = () => {
  const dispatch = useAppDispatch();

  // Получаем данные из стора
  const { orders, total, totalToday, loading, errorMessage } = useAppSelector(
    (state) => state.feed
  );

  // Если данные загружаются
  if (loading) return <Preloader />;

  // Если произошла ошибка при загрузке
  if (errorMessage) return <p>{errorMessage}</p>;

  // Готовые и ожидающие заказы
  const doneOrders = extractOrderNumbers(orders, 'done');
  const pendingOrders = extractOrderNumbers(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={doneOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
