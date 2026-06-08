import { ingredientsSlice, fetchIngredientsThunk, setIngredients, clearIngredientsError } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const reducer = ingredientsSlice.reducer;

const ingredientA: TIngredient = {
  _id: 'ing-1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 400,
  price: 120,
  image: 'image-a',
  image_large: 'image-large-a',
  image_mobile: 'image-mobile-a'
};

const ingredientB: TIngredient = {
  _id: 'ing-2',
  name: 'Соус',
  type: 'sauce',
  proteins: 2,
  fat: 5,
  carbohydrates: 8,
  calories: 100,
  price: 40,
  image: 'image-b',
  image_large: 'image-large-b',
  image_mobile: 'image-mobile-b'
};

describe('ingredients reducer', () => {
  it('should return initial state for unknown action with undefined state', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      isLoading: false,
      error: null,
      ingredients: []
    });
  });

  it('should handle setIngredients', () => {
    const state = reducer(undefined, setIngredients([ingredientA, ingredientB]));

    expect(state.ingredients).toEqual([ingredientA, ingredientB]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearIngredientsError', () => {
    const prevState = {
      isLoading: false,
      error: 'Some error',
      ingredients: [ingredientA]
    };

    const state = reducer(prevState, clearIngredientsError());

    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([ingredientA]);
  });

  it('should handle fetchIngredientsThunk.pending', () => {
    const prevState = {
      isLoading: false,
      error: 'Old error',
      ingredients: [ingredientA]
    };

    const state = reducer(prevState, fetchIngredientsThunk.pending('req-1', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([ingredientA]);
  });

  it('should handle fetchIngredientsThunk.fulfilled', () => {
    const prevState = {
      isLoading: true,
      error: null,
      ingredients: []
    };

    const payload = [ingredientA, ingredientB];
    const state = reducer(
      prevState,
      fetchIngredientsThunk.fulfilled(payload, 'req-2', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(payload);
  });

  it('should handle fetchIngredientsThunk.rejected with payload', () => {
    const prevState = {
      isLoading: true,
      error: null,
      ingredients: [ingredientA]
    };

    const state = reducer(
      prevState,
      fetchIngredientsThunk.rejected(null, 'req-3', undefined, 'Load failed')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Load failed');
    expect(state.ingredients).toEqual([ingredientA]);
  });
});
