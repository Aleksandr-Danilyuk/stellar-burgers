import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearAuthError,
  getAuthError,
  registerUserThunk
} from '../../services/slices/userSlice';

// Тип для состояния навигации
interface LocationState {
  from?: {
    pathname: string;
  };
}

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authError = useSelector(getAuthError);

  // Безопасное получение и валидация исходного маршрута
  const getRedirectPath = (): string => {
    const state = location.state as LocationState | null;
    const from = state?.from?.pathname;

    // Проверка: путь существует, строка, не пустой, не внешний URL
    if (
      from &&
      typeof from === 'string' &&
      from.trim() !== '' &&
      !from.startsWith('http')
    ) {
      return from;
    }

    return '/'; // Путь по умолчанию
  };

  const redirectPath = getRedirectPath();

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

      // Успешная регистрация — перенаправление
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
      // Ошибки обрабатываются через селектор authError
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
