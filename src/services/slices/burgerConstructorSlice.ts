import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { orderBurgerApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

type TOrderModalData = {
  number: number;
};

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TBurgerConstructorState = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrderModalData | null;
  error: string | null;
};

export const initialState: TBurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'Unknown error';
};

export const createOrderThunk = createAsyncThunk<
  TOrderModalData,
  string[],
  { rejectValue: string }
>('burgerConstructor/createOrder', async (ingredientsIds, thunkApi) => {
  try {
    const response = await orderBurgerApi(ingredientsIds);
    return { number: response.order.number };
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<TIngredient | TConstructorIngredient>
      ) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
          return;
        }

        state.constructorItems.ingredients.push(
          ingredient as TConstructorIngredient
        );
      },
      prepare: (ingredient: TIngredient) => ({
        payload:
          ingredient.type === 'bun'
            ? ingredient
            : {
                ...ingredient,
                id: uuidv4()
              }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index <= 0 || index >= state.constructorItems.ingredients.length) {
        return;
      }

      const items = state.constructorItems.ingredients;
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const lastIndex = state.constructorItems.ingredients.length - 1;

      if (index < 0 || index >= lastIndex) {
        return;
      }

      const items = state.constructorItems.ingredients;
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    },
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getBurgerConstructorError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Failed to create order';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  clearOrderModalData
} = burgerConstructorSlice.actions;

export const {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getBurgerConstructorError
} = burgerConstructorSlice.selectors;
