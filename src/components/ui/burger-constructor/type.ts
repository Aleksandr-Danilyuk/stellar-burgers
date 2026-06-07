import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TOrderModalData = {
  number: number;
};

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrderModalData | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
