import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchUserOrders } from '../../services/slices/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  const {
    userOrders,
    loading: isOrdersLoading,
    error: ordersErrorMessage
  } = useAppSelector((state) => state.order);

  // Загружаем заказы пользователя при монтировании компонента
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  if (ordersErrorMessage) {
    return <p className='text text_type_main-medium'>{ordersErrorMessage}</p>;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
