import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loginUser } from '../../services/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserData } from '../../services/thunks/userThunks';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

  // Получаем путь, откуда пришли
  const from = location.state?.from?.pathname;

  // Отправляем данные формы (логинимся)
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  // Когда статус логина "success" ,запрашиваем данные пользователя
  useEffect(() => {
    if (status === 'success') {
      dispatch(getUserData()); // загружаем user в стор
    }
  }, [status, dispatch]);

  // Когда пользователь загрузился редирект откуда пришли(либо на профиль)
  const user = useAppSelector((state) => state.user.user);
  useEffect(() => {
    if (user) {
      if (from) {
        // console.log('Redirecting to:', from);
        navigate(from, { replace: true }); // если был переход на login из-за редиректа
      } else {
        navigate('/profile', { replace: true }); // дефолтный редирект
      }
    }
  }, [user, from, navigate]);

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
