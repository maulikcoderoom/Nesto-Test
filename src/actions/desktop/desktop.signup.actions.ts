import { Page } from '@playwright/test';
import { BaseSignupActions } from '../base/base.signup.actions';
import { DesktopSignupLocators } from '../../locators/desktop/desktop.signup.locators';

export class DesktopSignupActions extends BaseSignupActions {
  constructor(page: Page) {
    super(new DesktopSignupLocators(page), page);
  }
}
