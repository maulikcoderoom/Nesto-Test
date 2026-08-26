import { Locator, Page } from '@playwright/test';
import { BaseActions } from './BaseActions';
import { BaseSignupLocators } from '../../locators/base/base.signup.locators';
import { SignupRegion } from '../../utils/types/project.types';

export interface SignupFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  region: SignupRegion;
}

export abstract class BaseSignupActions extends BaseActions {
  constructor(
    readonly locators: BaseSignupLocators,
    page: Page,
  ) {
    super(page);
  }

  async fillForm(data: SignupFormData): Promise<void> {
    await this.fill(this.locators.firstNameInput(), data.firstName);
    await this.fill(this.locators.lastNameInput(), data.lastName);
    await this.fill(this.locators.phoneInput(), data.phone);
    await this.selectOption(this.locators.regionSelect(), data.region);
    await this.fill(this.locators.emailInput(), data.email);
    await this.fill(this.locators.passwordInput(), data.password);
    await this.fill(this.locators.passwordConfirmationInput(), data.passwordConfirmation);
  }

  async acceptConsent(): Promise<void> {
    await this.check(this.locators.agreementCheckbox());
  }

  async submit(): Promise<void> {
    await this.click(this.locators.submitButton());
  }

  async switchLanguage(label: string): Promise<void> {
    await this.click(this.locators.languageLink(label));
  }

  /**
   * The field's own error message, resolved via its aria-describedby —
   * not a page-wide text search,
   */
  async errorFor(field: Locator): Promise<Locator> {
    const describedBy = await field.getAttribute('aria-describedby');
    if (!describedBy) {
      throw new Error('Field has no aria-describedby — cannot resolve its error message');
    }
    return this.page.locator(`#${describedBy}`);
  }
}
