import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
};

//export const IngredientsCategory = forwardRef<
//  HTMLUListElement,
//  TIngredientsCategoryProps
//>(({ title, titleRef, ingredients }, ref) => {
//  /** TODO: взять переменную из стора */
//  const burgerConstructor = {
//    bun: {
//      _id: ''
//    },
//    ingredients: []
//  };

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */
  //const allIngredients = useSelector(getIngredients);
  const burgerConstructor = useSelector(
    (state): TBurgerConstructorState =>
      (state as { burgerConstructor?: TBurgerConstructorState })
        .burgerConstructor ?? {
        bun: null,
        ingredients: []
      }
  );

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      //ingredients={allIngredients}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
