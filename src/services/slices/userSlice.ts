import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserData } from '../thunks/userThunks';
import { logoutApi } from '@api';
import { TokenManager } from '../../utils/tokenManager';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  errorMessage: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  errorMessage: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    finishAuthCheck(state) {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.errorMessage = null; // очищаем ошибку перед новым запросом
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.errorMessage = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.user = null;
        state.isAuthChecked = true; // при ошибке помечаем, что проверка завершена
        state.errorMessage = action.payload || 'Ошибка авторизации';
      });
  }
});

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutApi(); // Запрос к бэкенду
    } catch (err) {
      console.error('Ошибка логаута:', err);
    } finally {
      TokenManager.clearTokens(); // Удаляем токены
      dispatch(clearUser()); // Удаляем пользователя из стора
    }
  }
);
export const { setUser, clearUser, finishAuthCheck } = userSlice.actions;
export default userSlice.reducer;
