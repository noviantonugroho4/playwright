import { test } from "@playwright/test";
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test('login success', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com');
    await loginpage.doLogin();
  });
});