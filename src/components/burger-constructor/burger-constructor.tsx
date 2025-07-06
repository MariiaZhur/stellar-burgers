import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { clearOrder, makeOrder } from '../../services/slices/orderSlice';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  selectConstructorItems,
  selectOrder,
  selectOrderError,
  selectOrderLoading,
  selectOrderNumber,
  selectUserData
} from '@selectors';
import { useNavigate } from 'react-router-dom';
import { clearConstructor } from '../../services/slices/constructorBurgerSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Данные из store
  const constructorItems = useAppSelector(selectConstructorItems);
  const orderRequest = useAppSelector(selectOrderLoading);
  const orderNumber = useAppSelector(selectOrderNumber);
  const orderError = useAppSelector(selectOrderError);
  const order = useAppSelector(selectOrder); // Получаем весь заказ
  const user = useAppSelector(selectUserData); // Проверка авторизации

  // Отправка заказа
  const onOrderClick = () => {
    // Если пользователь не авторизован — отправляем на страницу логина
    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(makeOrder(ingredientIds)).then((res) => {
      if (makeOrder.fulfilled.match(res)) {
        dispatch(clearConstructor()); // очищаем конструктор при успехе
      }
    });
  };

  // Закрытие модалки
  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  // Итоговая стоимость
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
