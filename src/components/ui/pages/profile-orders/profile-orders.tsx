import { FC } from 'react';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';
import { logoutUser } from '../../../../services/slices/userSlice';
import { useAppDispatch } from '../../../../services/hooks';
import { useLocation } from 'react-router-dom';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <main className={`${styles.main}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu pathname={pathname} handleLogout={handleLogout} />
      </div>
      <div className={`mt-10 ${styles.orders}`}>
        <OrdersList orders={orders} />
      </div>
    </main>
  );
};
