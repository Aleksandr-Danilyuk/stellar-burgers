import { expect, Page, test } from '@playwright/test';

const API_PATTERN = '**/api/**';

const INGREDIENTS = {
  bun: 'Краторная булка N-200i',
  main: 'Биокотлета из марсианской Магнолии',
  sauce: 'Соус фирменный Space Sauce'
};

const applyHarMocks = async (page: Page) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: API_PATTERN,
    notFound: 'fallback'
  });
  await page.routeFromHAR('tests/hars/user-auth.har', {
    url: API_PATTERN,
    notFound: 'fallback'
  });
  await page.routeFromHAR('tests/hars/order-create.har', {
    url: API_PATTERN,
    notFound: 'fallback'
  });
};

const openApp = async (page: Page) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  await expect(page.getByText(INGREDIENTS.bun)).toBeVisible();
};

const addIngredient = async (page: Page, ingredientName: string) => {
  const card = page.locator('li', { hasText: ingredientName }).first();
  await card.getByRole('button', { name: 'Добавить' }).click();
};

const openIngredientModal = async (page: Page, ingredientName: string) => {
  const card = page.locator('li', { hasText: ingredientName }).first();
  await card.locator('a').first().click();
  await expect(page.locator('#modals').getByText('Детали ингредиента')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await applyHarMocks(page);
});

test('добавляет ингредиент из списка в конструктор', async ({ page }) => {
  await openApp(page);

  await addIngredient(page, INGREDIENTS.bun);

  await expect(page.getByText(`${INGREDIENTS.bun} (верх)`)).toBeVisible();
  await expect(page.getByText(`${INGREDIENTS.bun} (низ)`)).toBeVisible();
});

test('открывает и закрывает модальное окно ингредиента', async ({ page }) => {
  await openApp(page);

  await openIngredientModal(page, INGREDIENTS.main);
  await page.keyboard.press('Escape');
  await expect(page.locator('#modals').getByText('Детали ингредиента')).toBeHidden();
});

test('показывает данные выбранного ингредиента в модальном окне', async ({ page }) => {
  await openApp(page);

  await openIngredientModal(page, INGREDIENTS.main);
  await expect(page.locator('#modals').getByRole('heading', { name: INGREDIENTS.main })).toBeVisible();
  await expect(page.locator('#modals').getByText('4242')).toBeVisible();
});

test.describe('создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
      document.cookie = `accessToken=${encodeURIComponent('fake-access-token')}; path=/`;
    });
  });

  test.afterEach(async ({ page, context }) => {
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
    await context.clearCookies();
  });

  test('оформляет заказ и очищает конструктор', async ({ page }) => {
    await openApp(page);

    await addIngredient(page, INGREDIENTS.bun);
    await addIngredient(page, INGREDIENTS.main);
    await addIngredient(page, INGREDIENTS.sauce);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('77777')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});
