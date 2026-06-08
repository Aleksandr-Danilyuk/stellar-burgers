import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  getUpdateUserError,
  getUser,
  updateUserThunk
} from '../../services/slices/userSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  //const user = {
  //  name: '',
  //  email: ''
  //};
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const updateUserError = useSelector(getUpdateUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const changedData: { name?: string; email?: string; password?: string } =
      {};

    if (formValue.name !== (user?.name || '')) {
      changedData.name = formValue.name;
    }

    if (formValue.email !== (user?.email || '')) {
      changedData.email = formValue.email;
    }

    if (formValue.password) {
      changedData.password = formValue.password;
    }

    if (Object.keys(changedData).length === 0) {
      return;
    }

    try {
      await dispatch(updateUserThunk(changedData)).unwrap();
      setFormValue((prevState) => ({
        ...prevState,
        password: ''
      }));
    } catch {
      // error
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );

  return null;
};
