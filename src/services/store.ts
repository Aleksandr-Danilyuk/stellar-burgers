import { configureStore } from '@reduxjs/toolkit';
import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { ordersSlice } from './slices/ordersSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

//const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера
const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  burgerConstructorSlice,
  ordersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
