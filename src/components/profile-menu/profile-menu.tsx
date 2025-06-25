import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { ProfileMenuUIProps } from '../ui/profile-menu/type';

type Props = {
  pathname: string;
  handleLogout: () => void;
};

export const ProfileMenu: FC<Props> = ({ pathname, handleLogout }) => (
  <ProfileMenuUI pathname={pathname} handleLogout={handleLogout} />
);
