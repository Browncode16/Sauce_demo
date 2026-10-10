class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await this.page.waitForLoadState('domcontentloaded');
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillInfo({ firstName = 'John', lastName = 'Doe', postalCode = '12345' } = {}) {
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.continueButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { CheckoutPage };
