import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';
//import type { RootState } from '../store';

interface IIngredientsState {
  // Интерфейс начального состояния данных
  isLoading: boolean;
  error: string | null;
  ingredients: TIngredient[];
}

const initialState: IIngredientsState = {
  // начальное состояние данных приложения
  isLoading: false,
  error: null,
  ingredients: []
};

export const fetchIngredientsThunk = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchAll', async (_, thunkApi) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    return thunkApi.rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load ingredients'
    );
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.ingredients = action.payload;
    },
    clearIngredientsError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsLoading: (state) => state.isLoading,
    getIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      //.addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to load ingredients';
      });
  }
});

export const { setIngredients, clearIngredientsError } =
  ingredientsSlice.actions;

export const { getIngredients, getIngredientsLoading, getIngredientsError } =
  ingredientsSlice.selectors;
