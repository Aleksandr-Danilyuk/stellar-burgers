import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderByNumberThunk,
  getFeedOrders,
  getSelectedOrder,
  getSelectedOrderLoading,
  getUserOrders
} from '../../services/slices/ordersSlice';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(getIngredients);
  const selectedOrder = useSelector(getSelectedOrder);
  const feedOrders = useSelector(getFeedOrders);
  const userOrders = useSelector(getUserOrders);
  const isOrderLoading = useSelector(getSelectedOrderLoading);

  useEffect(() => {
    if (!number) {
      return;
    }

    const orderNumber = Number(number);
    if (Number.isNaN(orderNumber)) {
      return;
    }

    dispatch(fetchOrderByNumberThunk(orderNumber));
  }, [dispatch, number]);

  const orderData = useMemo(() => {
    if (!number) {
      return null;
    }

    const orderNumber = Number(number);
    if (Number.isNaN(orderNumber)) {
      return null;
    }

    return selectedOrder?.number === orderNumber
      ? selectedOrder
      : feedOrders.find((item) => item.number === orderNumber) ||
          userOrders.find((item) => item.number === orderNumber) ||
          null;
  }, [number, selectedOrder, feedOrders, userOrders]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || isOrderLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
