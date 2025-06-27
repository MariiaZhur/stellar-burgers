import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorBurgerState {
  bun: TConstructorIngredient | null; // выбранная булка
  ingredients: TConstructorIngredient[]; // начинка, без булки
}

const initialState: ConstructorBurgerState = {
  bun: null,
  ingredients: []
};

const constructorBurgerSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    // добавляем булку
    addBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    // добавляем ингредиент
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    // удаляем по уникальному id
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // перемещаем вверх по списку
    moveUpIngredientInList(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return;

      const temp = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index - 1];
      state.ingredients[index - 1] = temp;
    },
    // перемещаем вниз по списку
    moveDownIngredientInList(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return;

      const temp = state.ingredients[index];
      state.ingredients[index] = state.ingredients[index + 1];
      state.ingredients[index + 1] = temp;
    },
    // очищаем всё
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveUpIngredientInList,
  moveDownIngredientInList,
  clearConstructor
} = constructorBurgerSlice.actions;

export default constructorBurgerSlice.reducer;
