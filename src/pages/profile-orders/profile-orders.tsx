import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrdersThunk,
  getUserOrders
} from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
