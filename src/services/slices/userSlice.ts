import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCookie } from '../../utils/cookie';
import {
  getUserApi,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  updateUserError: null
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

export const checkUserAuthThunk = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, thunkApi) => {
  if (!getCookie('accessToken')) {
    return null;
  }

  try {
    const response = await getUserApi();
    if (response.success) {
      return response.user;
    }
    return thunkApi.rejectWithValue('Failed to load user data');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userData, thunkApi) => {
  try {
    const response = await updateUserApi(userData);
    if (response.success) {
      return response.user;
    }
    return thunkApi.rejectWithValue('Failed to update user data');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error,
    getUpdateUserError: (state) => state.updateUserError
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuthThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(checkUserAuthThunk.rejected, (state, action) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to load user data';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.updateUserError = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateUserError = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.updateUserError = action.payload ?? 'Failed to update user data';
      });
  }
});

export const {
  getUser,
  getIsAuthChecked,
  getUserLoading,
  getUserError,
  getUpdateUserError
} = userSlice.selectors;
