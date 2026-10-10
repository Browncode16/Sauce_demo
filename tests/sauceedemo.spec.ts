const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/saucedemo/LoginPage');
const { InventoryPage } = require('../pages/saucedemo/InventoryPage');
const { CartPage } = require('../pages/saucedemo/CartPage');
const { CheckoutPage } = require('../pages/saucedemo/CheckoutPage');

async function loginAs(page, username = 'standard_user', password = 'secret_sauce') {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
}

test.describe('SauceDemo POM flows', () => {
  test('01 - standard user can log in successfully', async ({ page }) => {
    await loginAs(page);

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('02 - locked out user gets an error and cannot log in', async ({ page }) => {
    await loginAs(page, 'locked_out_user', 'secret_sauce');

    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface');
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });

  test('03 - invalid credentials show a login error', async ({ page }) => {
    await loginAs(page, 'standard_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match any user in this service');
  });

  test('04 - blank username shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('05 - blank password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('06 - problem user can log in', async ({ page }) => {
    await loginAs(page, 'problem_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('07 - performance glitch user can log in', async ({ page }) => {
    await loginAs(page, 'performance_glitch_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('08 - inventory page displays 6 products', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    const names = await inventoryPage.getItemNames();

    expect(names).toHaveLength(6);
  });

  test('09 - inventory items sort alphabetically A to Z', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('az');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('10 - inventory items sort alphabetically Z to A', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('11 - inventory items sort by price low to high', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((value) => Number(value.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });

  test('12 - inventory items sort by price high to low', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('hilo');

    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map((value) => Number(value.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => b - a);
    expect(numericPrices).toEqual(sorted);
  });

  test('13 - adding one product updates the cart badge to 1', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('14 - adding two products updates the cart badge to 2', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('15 - remove button appears after adding a product', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');

    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

  test('16 - product can be removed from the cart on the inventory page', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
  });

  test('17 - cart page shows the added item count', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await cartPage.goto();

    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('18 - user can proceed from cart to checkout', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    await cartPage.checkout();

    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('19 - valid checkout details move to the overview step', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    await cartPage.checkout();
    await checkoutPage.fillInfo({ firstName: 'John', lastName: 'Doe', postalCode: '12345' });
    await checkoutPage.continueToOverview();

    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('20 - canceling checkout returns to the cart page', async ({ page }) => {
    await loginAs(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await cartPage.goto();
    await cartPage.checkout();
    await page.locator('[data-test="cancel"]').click();

    await expect(page).toHaveURL(/.*cart\.html/);
  });
});
