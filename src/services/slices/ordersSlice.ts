import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';

type TFeedMeta = {
  total: number;
  totalToday: number;
};

type TOrdersState = {
  feedOrders: TOrder[];
  userOrders: TOrder[];
  feedMeta: TFeedMeta;
  selectedOrder: TOrder | null;
  isFeedLoading: boolean;
  isUserOrdersLoading: boolean;
  isSelectedOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feedOrders: [],
  userOrders: [],
  feedMeta: {
    total: 0,
    totalToday: 0
  },
  selectedOrder: null,
  isFeedLoading: false,
  isUserOrdersLoading: false,
  isSelectedOrderLoading: false,
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

export const fetchFeedsThunk = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('orders/fetchFeeds', async (_, thunkApi) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUserOrders', async (_, thunkApi) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOrderByNumberThunk = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchByNumber', async (number, thunkApi) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      return thunkApi.rejectWithValue('Order not found');
    }

    return order;
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  selectors: {
    getFeedOrders: (state) => state.feedOrders,
    getUserOrders: (state) => state.userOrders,
    getFeedMeta: (state) => state.feedMeta,
    getSelectedOrder: (state) => state.selectedOrder,
    getFeedLoading: (state) => state.isFeedLoading,
    getUserOrdersLoading: (state) => state.isUserOrdersLoading,
    getSelectedOrderLoading: (state) => state.isSelectedOrderLoading,
    getOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsThunk.pending, (state) => {
        state.isFeedLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedsThunk.fulfilled, (state, action) => {
        state.feedOrders = action.payload.orders;
        state.feedMeta = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
        state.isFeedLoading = false;
      })
      .addCase(fetchFeedsThunk.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.error = action.payload ?? 'Failed to load feeds';
      })
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.isUserOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.isUserOrdersLoading = false;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.isUserOrdersLoading = false;
        state.error = action.payload ?? 'Failed to load user orders';
      })
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.isSelectedOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.isSelectedOrderLoading = false;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.isSelectedOrderLoading = false;
        state.error = action.payload ?? 'Failed to load order details';
      });
  }
});

export const { clearSelectedOrder } = ordersSlice.actions;

export const {
  getFeedOrders,
  getUserOrders,
  getFeedMeta,
  getSelectedOrder,
  getFeedLoading,
  getUserOrdersLoading,
  getSelectedOrderLoading,
  getOrdersError
} = ordersSlice.selectors;
