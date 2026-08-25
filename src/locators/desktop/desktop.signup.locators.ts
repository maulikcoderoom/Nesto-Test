import { Page } from '@playwright/test';
import { BaseSignupLocators } from '../base/base.signup.locators';

export class DesktopSignupLocators extends BaseSignupLocators {
  constructor(page: Page) {
    super(page);
  }
}
