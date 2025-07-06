import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { selectAllIngredients, selectFeedOrders } from '@selectors';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора (done)*/
  // Получаем номер заказа из URL
  const { number } = useParams<{ number: string }>();

  // Получаем список всех ингредиентов из стора
  const ingredients = useAppSelector(selectAllIngredients);
  const orders = useAppSelector(selectFeedOrders);

  // Флаг загрузки (да нет, нет да)
  const [loading, setLoading] = useState(true);

  // Состояние заказа
  const [order, setOrder] = useState<TOrder | null>(null);

  // При монтировании пробуем взять заказ из стора, иначе грузим по API
  useEffect(() => {
    const found = orders.find((o) => o.number === Number(number));

    if (found) {
      setOrder(found);
      setLoading(false);
    } else {
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.orders && res.orders.length > 0) {
            setOrder(res.orders[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [orders, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  // Пока нет данных или идёт загрузка — показываем прелоадер
  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
