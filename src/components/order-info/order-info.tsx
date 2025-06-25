import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { selectAllIngredients, selectFeedOrders } from '@selectors';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора (done)*/
  // Получаем номер заказа из URL
  const { number } = useParams<{ number: string }>();

  // Получаем заказ из стора по номеру
  const orderData = useAppSelector((state) =>
    selectFeedOrders(state).find(
      (order: TOrder) => order.number === Number(number)
    )
  );

  // Получаем список всех ингредиентов из стора
  const ingredients = useAppSelector(selectAllIngredients);

  // Пока нет данных — показываем прелоадер
  if (!orderData || !ingredients.length) {
    return <Preloader />;
  }

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
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
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  return <OrderInfoUI orderInfo={orderInfo} />;
};
