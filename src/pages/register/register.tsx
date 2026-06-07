import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearAuthError,
  getAuthError,
  registerUserThunk
} from '../../services/slices/userSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authError = useSelector(getAuthError);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(clearAuthError());

    try {
      await dispatch(
        registerUserThunk({
          name: userName,
          email,
          password
        })
      ).unwrap();

      navigate('/', { replace: true });
    } catch {
      // error
    }
  };

  return (
    <RegisterUI
      errorText={authError || undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
