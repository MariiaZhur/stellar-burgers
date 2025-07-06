import { TIngredient } from '@utils-types';
import { RootState } from './store';

// Получаем данные пользователя
export const selectUserData = (state: RootState) => state.user.user;
// Проверяем состояние авторизации
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;
// Все ингредиенты
export const selectAllIngredients = (state: RootState) =>
  state.ingredients.list;
// Загрузка ингредиентов
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
// Ошибка загрузки ингредиентов
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.errorMessage;

// Фильтрация по категориям
export const selectBuns = (state: RootState): TIngredient[] =>
  state.ingredients.list.filter((item) => item.type === 'bun');

export const selectMains = (state: RootState): TIngredient[] =>
  state.ingredients.list.filter((item) => item.type === 'main');

export const selectSauces = (state: RootState): TIngredient[] =>
  state.ingredients.list.filter((item) => item.type === 'sauce');

// Конструктор бургера
export const selectConstructorItems = (state: RootState) =>
  state.constructorBurger;
// Запрос заказа
export const selectOrderRequest = (state: RootState) => state.order.loading;

// Модалка с деталями заказа
export const selectOrderModalData = (state: RootState) => state.order.order;
// всё к заказу
export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrderNumber = (state: RootState) =>
  state.order.order?.number ?? null;

export const selectFullOrderInfo = (state: RootState) =>
  state.feed.fullOrderInfo;
// Получаем список заказов из фида
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.loading;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedError = (state: RootState) => state.feed.errorMessage;
