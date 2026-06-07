import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeedsThunk,
  getFeedLoading,
  getFeedOrders
} from '../../services/slices/ordersSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);
  const isFeedLoading = useSelector(getFeedLoading);

  useEffect(() => {
    dispatch(fetchFeedsThunk());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeedsThunk());
  };

  if (isFeedLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
