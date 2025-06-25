import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorBurgerReducer from './slices/constructorBurgerSlice';
import orderReducer from './slices/orderSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  ingredients: ingredientsReducer,
  constructorBurger: constructorBurgerReducer,
  order: orderReducer,
  auth: authReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
