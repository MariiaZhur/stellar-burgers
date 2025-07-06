import { updateUserApi } from '@api';
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { logoutUser, setUser } from '../../services/slices/userSlice';
import { useLocation } from 'react-router-dom';
/** TODO: взять переменную из стора (done) */
export const Profile: FC = () => {
  const user = useAppSelector((state) => state.user.user)!;
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await updateUserApi(formValue);
      dispatch(setUser(response.user));
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении профиля');
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  const handleLogout = () => {
    dispatch(logoutUser()); // выход
  };
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleLogout={handleLogout}
      pathname={pathname}
    />
  );
};
