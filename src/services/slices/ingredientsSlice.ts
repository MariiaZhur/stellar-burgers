import { getIngredientsApi } from '../../utils/burger-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Интерфейс состояния для ингредиентов
interface IngredientsState {
  list: TIngredient[];
  loading: boolean;
  errorMessage: string | null;
}

// Начальное состояние
const initialState: IngredientsState = {
  list: [],
  loading: false,
  errorMessage: null
};

// Асинхронный экшен для запроса ингредиентов с сервера
export const loadIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/load', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    // console.log('Получили данные:', data);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Не удалось загрузить ингредиенты');
  }
});

// Слайс ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(
        loadIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          // console.log(' payload:', action.payload);
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(loadIngredients.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Произошла ошибка при загрузке';
      });
  }
});

export default ingredientsSlice.reducer;
