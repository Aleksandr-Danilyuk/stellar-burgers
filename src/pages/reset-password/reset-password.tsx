import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  clearResetPasswordError,
  getResetPasswordError,
  resetPasswordThunk
} from '../../services/slices/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const resetPasswordError = useSelector(getResetPasswordError);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearResetPasswordError());

    try {
      await dispatch(resetPasswordThunk({ password, token })).unwrap();
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    } catch {
      // (err) => setError(err)
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={resetPasswordError || undefined}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
