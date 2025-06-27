import { useAppSelector } from '../../services/hooks';
import { selectAuthChecked, selectUserData } from '../../services/selectors';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { ReactElement } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // true — маршрут доступен только неавторизованным
  children: ReactElement; // дочерний компонент, который должен быть показан
};

// Компонент защищённого маршрута
export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useAppSelector(selectAuthChecked); // проверка завершена или нет
  const user = useAppSelector(selectUserData); // получаем пользователя из стора
  const location = useLocation(); // текущий путь
  // console.log('isAuthChecked:', isAuthChecked);
  // console.log('user:', user);
  // показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь неавторизован, но страница требует авторизации — редирект на /login
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  // Если пользователь авторизован, но страница только для гостей  — редирект обратно
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' }; // возвращаем на сохранённый путь или на /
    return <Navigate to={from} replace />;
  }

  // Если всё в порядке — рендерим нужный компонент
  return children;
};
