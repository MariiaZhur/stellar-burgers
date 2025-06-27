import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface FeedState {
  orders: TOrder[]; // Лента заказов
  total: number; // Всего заказов
  totalToday: number; // Заказов за сегодня
  loading: boolean;
  errorMessage: string | null;
  fullOrderInfo: TOrder | null; // Детали одного конкретного заказа
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  errorMessage: null,
  fullOrderInfo: null
};

// Загрузка общей ленты заказов
export const loadFeed = createAsyncThunk(
  'feed/load',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказов');
    }
  }
);

// Загрузка одного заказа по номеру
export const getFullOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feed/getFullOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(orderNumber);
    return data.orders[0]; // Возвращаем первый (и единственный) заказ
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка загрузки заказа');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Лента заказов
      .addCase(loadFeed.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        loadFeed.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(loadFeed.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка загрузки';
      })

      // Один заказ по номеру
      .addCase(getFullOrderByNumber.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        getFullOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.fullOrderInfo = action.payload;
        }
      )
      .addCase(getFullOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Ошибка получения заказа';
      });
  }
});

export default feedSlice.reducer;
