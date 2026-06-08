import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  clearOrderModalData,
  createOrderThunk
} from './burgerConstructorSlice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

const reducer = burgerConstructorSlice.reducer;

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 400,
  price: 125,
  image: 'bun-image',
  image_large: 'bun-image-large',
  image_mobile: 'bun-image-mobile'
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Фирменный соус',
  type: 'sauce',
  proteins: 2,
  fat: 8,
  carbohydrates: 6,
  calories: 90,
  price: 35,
  image: 'sauce-image',
  image_large: 'sauce-image-large',
  image_mobile: 'sauce-image-mobile'
};

const mainA: TConstructorIngredient = {
  _id: 'main-1',
  id: 'c-1',
  name: 'Котлета',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 5,
  calories: 180,
  price: 80,
  image: 'main-a-image',
  image_large: 'main-a-image-large',
  image_mobile: 'main-a-image-mobile'
};

const mainB: TConstructorIngredient = {
  _id: 'main-2',
  id: 'c-2',
  name: 'Сыр',
  type: 'main',
  proteins: 7,
  fat: 9,
  carbohydrates: 2,
  calories: 120,
  price: 50,
  image: 'main-b-image',
  image_large: 'main-b-image-large',
  image_mobile: 'main-b-image-mobile'
};

describe('burgerConstructor reducer', () => {
  it('should return initial state for unknown action with undefined state', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  it('should handle addIngredient for bun', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.constructorItems.bun).toEqual(bun);
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('should handle addIngredient for non-bun', () => {
    const state = reducer(undefined, addIngredient(sauce));

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toMatchObject(sauce);
    expect(state.constructorItems.ingredients[0].id).toEqual(expect.any(String));
  });

  it('should handle removeIngredient', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA, mainB]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    const state = reducer(prevState, removeIngredient('c-1'));

    expect(state.constructorItems.ingredients).toEqual([mainB]);
  });

  it('should handle moveIngredientUp', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA, mainB]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    const state = reducer(prevState, moveIngredientUp(1));

    expect(state.constructorItems.ingredients).toEqual([mainB, mainA]);
  });

  it('should handle moveIngredientDown', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA, mainB]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    const state = reducer(prevState, moveIngredientDown(0));

    expect(state.constructorItems.ingredients).toEqual([mainB, mainA]);
  });

  it('should handle clearConstructor', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA, mainB]
      },
      orderRequest: false,
      orderModalData: null,
      error: null
    };

    const state = reducer(prevState, clearConstructor());

    expect(state.constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('should handle clearOrderModalData', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA]
      },
      orderRequest: false,
      orderModalData: { number: 12345 },
      error: null
    };

    const state = reducer(prevState, clearOrderModalData());

    expect(state.orderModalData).toBeNull();
  });

  it('should handle createOrderThunk.pending', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA]
      },
      orderRequest: false,
      orderModalData: null,
      error: 'old error'
    };

    const state = reducer(prevState, createOrderThunk.pending('req-1', ['bun-1', 'main-1']));

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createOrderThunk.fulfilled', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA, mainB]
      },
      orderRequest: true,
      orderModalData: null,
      error: null
    };

    const state = reducer(
      prevState,
      createOrderThunk.fulfilled({ number: 67890 }, 'req-2', ['bun-1', 'main-1'])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual({ number: 67890 });
    expect(state.constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('should handle createOrderThunk.rejected with payload', () => {
    const prevState = {
      constructorItems: {
        bun,
        ingredients: [mainA]
      },
      orderRequest: true,
      orderModalData: null,
      error: null
    };

    const state = reducer(
      prevState,
      createOrderThunk.rejected(null, 'req-3', ['bun-1', 'main-1'], 'Order failed')
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Order failed');
  });
});
