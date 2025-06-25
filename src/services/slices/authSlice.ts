import { loginUserApi, logoutApi, registerUserApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TRegisterRequest, TAuthResponse, TLoginRequest } from '@utils-types';
import { TokenManager } from '../../utils/tokenManager';

interface AuthState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  status: 'idle',
  error: null
};

// Логин: отправляем email + password → сохраняем токены
export const loginUser = createAsyncThunk<
  TAuthResponse,
  TLoginRequest,
  { rejectValue: string }
>('auth/loginUser', async (authData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(authData);
    TokenManager.saveTokens(response.accessToken, response.refreshToken);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка авторизации');
  }
});

// Регистрация: почти как логин — тоже сохраняем токены
export const registerUser = createAsyncThunk<
  TAuthResponse,
  TRegisterRequest,
  { rejectValue: string }
>('auth/registerUser', async (authData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(authData);
    TokenManager.saveTokens(response.accessToken, response.refreshToken);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка регистрации');
  }
});

// Выход: очищаем токены и вызываем logout на сервере
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  TokenManager.clearTokens();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || 'Ошибка входа';
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload || 'Ошибка регистрации';
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      });
  }
});

export default authSlice.reducer;
