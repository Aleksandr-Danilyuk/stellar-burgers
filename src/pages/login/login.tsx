import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearAuthError,
  getAuthError,
  loginUserThunk
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useSelector(getAuthError);

  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearAuthError());

    try {
      await dispatch(loginUserThunk({ email, password })).unwrap();
      navigate(from || '/', { replace: true });
    } catch {
      // (err) => setError(err)
    }
  };

  return (
    <LoginUI
      errorText={authError || undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
