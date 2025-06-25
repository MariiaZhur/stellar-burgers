import { Routes, Route, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  useAppDispatch,
  useAppSelector as useSelector
} from '../../services/hooks';
import { selectAuthChecked, selectUserData } from '@selectors';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';

import { getUserData } from '../../services/thunks/userThunks';
import { loadIngredients } from '../../services/slices/ingredientsSlice';
import { TokenManager } from '../../utils/tokenManager';
import { finishAuthCheck } from '../../services/slices/userSlice';

const App = () => {
  // получаем из стора статус проверки авторизации и текущего пользователя
  const isChecked = useSelector(selectAuthChecked); // проверено состояние авторизации
  const currentUser = useSelector(selectUserData); // сам пользователь (если есть)
  // используем чтобы отрисовать модальное окно поверх страницы.
  //  React Router с помощью location.state.
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = TokenManager.getAccessToken();

    if (accessToken) {
      dispatch(getUserData());
    } else {
      // Если токена нет то явно указываем что проверка завершена
      dispatch(finishAuthCheck());
    }
    dispatch(loadIngredients());
  }, [dispatch]);

  const location = useLocation();
  const backgroundLocation = location.state?.background;
  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты: backgroundLocation для поддержки модальных окон */}
      <Routes location={backgroundLocation || location}>
        {/* общедоступные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* маршруты только НЕавторизованным пользователям */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* маршруты только авторизованным пользователям */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* отдельная страница ингредиента */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модалка ингредиента, если пришли из фона */}
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали' onClose={() => window.history.back()}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Информация о заказе'
                onClose={() => window.history.back()}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Информация о заказе'
                  onClose={() => window.history.back()}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
