import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import {
  getUserApi,
  TRegisterData,
  updateUserApi,
  registerUserApi,
  resetPasswordApi,
  forgotPasswordApi,
  loginUserApi,
  logoutApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  updateUserError: string | null;
  authError: string | null;
  forgotPasswordError: string | null;
  resetPasswordError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  updateUserError: null,
  authError: null,
  forgotPasswordError: null,
  resetPasswordError: null
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

export const registerUserThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (userData, thunkApi) => {
  try {
    const response = await registerUserApi(userData);
    if (response.success) {
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    }
    return thunkApi.rejectWithValue('Failed to register user');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const loginUserThunk = createAsyncThunk<
  TUser,
  { email: string; password: string },
  { rejectValue: string }
>('user/login', async (loginData, thunkApi) => {
  try {
    const response = await loginUserApi(loginData);
    if (response.success) {
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response.user;
    }
    return thunkApi.rejectWithValue('Failed to login');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logout', async (_, thunkApi) => {
  try {
    const response = await logoutApi();
    if (response.success) {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return;
    }
    return thunkApi.rejectWithValue('Failed to logout');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, thunkApi) => {
  try {
    const response = await forgotPasswordApi(data);
    if (response.success) {
      return;
    }
    return thunkApi.rejectWithValue('Failed to request password reset');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, thunkApi) => {
  try {
    const response = await resetPasswordApi(data);
    if (response.success) {
      return;
    }
    return thunkApi.rejectWithValue('Failed to reset password');
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error));
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },
    clearForgotPasswordError: (state) => {
      state.forgotPasswordError = null;
    },
    clearResetPasswordError: (state) => {
      state.resetPasswordError = null;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error,
    getUpdateUserError: (state) => state.updateUserError,
    getAuthError: (state) => state.authError,
    getForgotPasswordError: (state) => state.forgotPasswordError,
    getResetPasswordError: (state) => state.resetPasswordError
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
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.authError = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.authError = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.authError = action.payload ?? 'Failed to register user';
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.authError = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.authError = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.authError = action.payload ?? 'Failed to login';
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.authError = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.authError = action.payload ?? 'Failed to logout';
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.forgotPasswordError = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.forgotPasswordError = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.forgotPasswordError =
          action.payload ?? 'Failed to request password reset';
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.resetPasswordError = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.resetPasswordError = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.resetPasswordError = action.payload ?? 'Failed to reset password';
      });
  }
});

export const {
  clearAuthError,
  clearForgotPasswordError,
  clearResetPasswordError
} = userSlice.actions;

export const {
  getUser,
  getIsAuthChecked,
  getUserLoading,
  getUserError,
  getUpdateUserError,
  getAuthError,
  getForgotPasswordError,
  getResetPasswordError
} = userSlice.selectors;
