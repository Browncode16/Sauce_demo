class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async login(username = 'standard_user', password = 'secret_sauce') {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordInput.fill(password);
    await this.loginButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { LoginPage };
