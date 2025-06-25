import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi } from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { finishAuthCheck } from '../slices/userSlice';

// Получение информации о пользователе при старте приложения
export const getUserData = createAsyncThunk<
  TUser, // thunk вернет объект пользователя
  void, // ничего не передаём
  { rejectValue: string } // Тип ошибки, если отклонено
>('user/getUserData', async (_, thunkAPI) => {
  const { rejectWithValue, dispatch } = thunkAPI;
  try {
    const token = getCookie('accessToken');

    if (!token) {
      dispatch(finishAuthCheck()); // 👈 нужно завершить проверку
      return rejectWithValue('Токен отсутствует');
    }
    // Выполняем запрос
    const response = await getUserApi();
    return response.user;
  } catch (error: any) {
    dispatch(finishAuthCheck());
    return rejectWithValue(
      error.message || 'Ошибка получения данных о пользователе'
    );
  }
});
