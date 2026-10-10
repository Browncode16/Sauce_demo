class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
    await this.page.waitForLoadState('domcontentloaded');
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
  }

  async itemCount() {
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => null);
    return await this.cartItems.count();
  }

  async checkout() {
    await this.checkoutButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { CartPage };
