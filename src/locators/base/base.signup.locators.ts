import { Page } from '@playwright/test';

export abstract class BaseSignupLocators {
  constructor(protected page: Page) {}

  firstNameInput = () => this.page.getByTestId('first-name-input');
  lastNameInput = () => this.page.getByTestId('last-name-input');
  phoneInput = () => this.page.getByTestId('phoneInput');
  regionSelect = () => this.page.getByTestId('region-select');
  regionPlaceholderOption = () => this.regionSelect().locator('option').first();
  selectedRegionOption = () => this.regionSelect().locator('option:checked');
  emailInput = () => this.page.getByTestId('email-input');
  passwordInput = () => this.page.getByTestId('password-input');
  passwordConfirmationInput = () => this.page.getByTestId('passwordConfirmation-input');
  agreementCheckbox = () => this.page.getByTestId('agreement-checkbox');
  consentLabel = () => this.page.locator('label[for="leadDistributeConsentAgreement"]');
  submitButton = () =>
    this.page.getByRole('button', { name: /create your account|Créez votre compte/i });
  heading = () => this.page.getByRole('heading', { level: 2 });
  languageLink = (label: string) => this.page.getByRole('link', { name: label, exact: true });
  errorText = (message: string) => this.page.getByText(message, { exact: true });
}
