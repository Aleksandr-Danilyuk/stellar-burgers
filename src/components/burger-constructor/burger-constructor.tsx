import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModalData,
  createOrderThunk,
  getConstructorItems,
  getOrderModalData,
  getOrderRequest
} from '../../services/slices/burgerConstructorSlice';
import { getUser } from '../../services/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  fetchFeedsThunk,
  fetchUserOrdersThunk
} from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const user = useSelector(getUser);

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    const result = await dispatch(createOrderThunk(ingredientsIds));

    if (createOrderThunk.fulfilled.match(result)) {
      dispatch(fetchFeedsThunk());
      dispatch(fetchUserOrdersThunk());
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
