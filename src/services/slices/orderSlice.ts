import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

// Тип состояния
interface OrderState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
  userOrders: TOrder[];
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
  userOrders: [] // заказы текущего пользователя
};

// Thunk — отправка заказа
export const makeOrder = createAsyncThunk<
  TOrder, // возвращаем весь заказ
  string[], // передаём массив id ингредиентов
  { rejectValue: string }
>('order/makeOrder', async (ids, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ids);
    return data.order; //возвращаем весь объект заказа
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка оформления заказа');
  }
});

// Thunk — загрузка заказов пользователя
export const fetchUserOrders = createAsyncThunk<
  TOrder[], // возвращаем массив заказов
  void,
  { rejectValue: string }
>('order/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err: any) {
    return rejectWithValue(
      err.message || 'Ошибка загрузки заказов пользователя'
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      })

      // добавили обработку fetchUserOrders
      // Обработка состояний fetchUserOrders: загрузка,
      //  успех, ошибка при получении заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки заказов пользователя';
      });
  }
});

// действия
export const { clearOrder } = orderSlice.actions;

// редьюсер
export default orderSlice.reducer;
