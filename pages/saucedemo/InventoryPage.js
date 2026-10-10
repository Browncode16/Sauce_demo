class InventoryPage {
  constructor(page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.page.waitForLoadState('domcontentloaded');
    await this.inventoryItems.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async sortBy(option) {
    await this.sortDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState('networkidle');
  }

  async addProductToCartByName(productName) {
    const product = this.page.locator('.inventory_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });

    await product.waitFor({ state: 'visible', timeout: 15000 });
    await product.locator('button').waitFor({ state: 'visible', timeout: 15000 });
    await product.locator('button').click();
    await this.cartBadge.waitFor({ state: 'visible', timeout: 15000 });
  }

  async getItemNames() {
    await this.itemNames.first().waitFor({ state: 'visible', timeout: 15000 });
    return await this.itemNames.allTextContents();
  }
}

module.exports = { InventoryPage };
