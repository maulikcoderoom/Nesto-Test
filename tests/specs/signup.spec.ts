import { test, expect } from '../../src/utils/fixtures';
import { getTestData } from '../../src/utils/config/project-context';
import { generateUniqueEmail } from '../../src/utils/generators/generate-unique-email';
import { generateUniquePhone } from '../../src/utils/generators/generate-unique-phone';
import { Language, SignupRegion, SIGNUP_REGION_LABELS } from '../../src/utils/types/project.types';
import testData from '../data/test-data.json';

function signupPath(language: Language): string {
  return language === Language.FR ? '/fr/signup' : '/signup';
}

function waitForAccountsResponse(page: import('@playwright/test').Page) {
  return page.waitForResponse(
    response => response.url().includes('/api/accounts') && response.request().method() === 'POST',
  );
}

test.describe('Signup', () => {
  test(
    'signup - test1001 - creates an account with valid details',
    { tag: ['@signup', '@positive', '@api'] },
    async ({ signupPage, projectContext, page }) => {
      const data = getTestData(testData.signup.test1001.desktop, projectContext);
      const email = generateUniqueEmail();
      const phone = generateUniquePhone();

      await signupPage.goto(signupPath(projectContext.language));
      await expect(signupPage.locators.heading()).toHaveText(data.heading);

      const region = data.region as SignupRegion;

      const responsePromise = waitForAccountsResponse(page);
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone,
        email,
        password: data.password,
        passwordConfirmation: data.password,
        region,
      });
      await expect(signupPage.locators.selectedRegionOption()).toHaveText(
        getTestData(SIGNUP_REGION_LABELS[region], projectContext),
      );
      await signupPage.submit();

      const response = await responsePromise;
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.account.email).toBe(email);
      expect(body.account.firstName).toBe(data.firstName);
      expect(body.account.lastName).toBe(data.lastName);
      expect(body.account.region).toBe(region);

      await expect(page).not.toHaveURL(/\/signup$/);
    },
  );

  test(
    'signup - test1002 - succeeds with the consent checkbox left unchecked',
    { tag: ['@signup', '@positive'] },
    async ({ signupPage, projectContext, page }) => {
      const data = getTestData(testData.signup.test1002.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await expect(signupPage.locators.agreementCheckbox()).not.toBeChecked();

      const responsePromise = waitForAccountsResponse(page);
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: generateUniquePhone(),
        email: generateUniqueEmail(),
        password: data.password,
        passwordConfirmation: data.password,
        region: data.region as SignupRegion,
      });
      await signupPage.submit();

      expect((await responsePromise).status()).toBe(201);
    },
  );

  test(
    'signup - test1003 - rejects an empty form',
    { tag: ['@signup', '@negative'] },
    async ({ signupPage, projectContext }) => {
      const data = getTestData(testData.signup.test1003.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.submit();

      await expect(await signupPage.errorFor(signupPage.locators.firstNameInput())).toHaveText(
        data.errors.firstNameRequired,
      );
      await expect(await signupPage.errorFor(signupPage.locators.lastNameInput())).toHaveText(
        data.errors.lastNameRequired,
      );
      await expect(await signupPage.errorFor(signupPage.locators.phoneInput())).toHaveText(
        data.errors.phoneInvalid,
      );
      await expect(await signupPage.errorFor(signupPage.locators.emailInput())).toHaveText(
        data.errors.emailInvalid,
      );
      await expect(await signupPage.errorFor(signupPage.locators.passwordInput())).toHaveText(
        data.errors.passwordTooShort,
      );
    },
  );

  test(
    'signup - test1004 - rejects an invalid email format',
    { tag: ['@signup', '@negative'] },
    async ({ signupPage, projectContext }) => {
      const data = getTestData(testData.signup.test1004.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: generateUniquePhone(),
        email: data.invalidEmail,
        password: data.password,
        passwordConfirmation: data.password,
        region: data.region as SignupRegion,
      });
      await signupPage.submit();

      await expect(await signupPage.errorFor(signupPage.locators.emailInput())).toHaveText(
        data.expectedError,
      );
    },
  );

  test(
    'signup - test1005 - rejects a password under 12 characters',
    { tag: ['@signup', '@negative'] },
    async ({ signupPage, projectContext }) => {
      const data = getTestData(testData.signup.test1005.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: generateUniquePhone(),
        email: generateUniqueEmail(),
        password: data.shortPassword,
        passwordConfirmation: data.shortPassword,
        region: data.region as SignupRegion,
      });
      await signupPage.submit();

      await expect(await signupPage.errorFor(signupPage.locators.passwordInput())).toHaveText(
        data.expectedError,
      );
    },
  );

  test(
    'signup - test1006 - rejects a password missing upper/lowercase or a number',
    { tag: ['@signup', '@negative', '@regression'] },
    async ({ signupPage, projectContext }) => {
      const data = getTestData(testData.signup.test1006.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: generateUniquePhone(),
        email: generateUniqueEmail(),
        password: data.weakPassword,
        passwordConfirmation: data.weakPassword,
        region: data.region as SignupRegion,
      });
      await signupPage.submit();

      await expect(await signupPage.errorFor(signupPage.locators.passwordInput())).toHaveText(
        data.expectedError,
      );
    },
  );

  test(
    'signup - test1007 - rejects a mismatched password confirmation',
    { tag: ['@signup', '@negative', '@regression'] },
    async ({ signupPage, projectContext }) => {
      const data = getTestData(testData.signup.test1007.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: generateUniquePhone(),
        email: generateUniqueEmail(),
        password: data.password,
        passwordConfirmation: data.mismatchedConfirmation,
        region: data.region as SignupRegion,
      });
      await signupPage.submit();

      await expect(
        await signupPage.errorFor(signupPage.locators.passwordConfirmationInput()),
      ).toHaveText(data.expectedError);
    },
  );

  test(
    'signup - test1008 - rejects an email that is already registered',
    { tag: ['@signup', '@negative'] },
    async ({ signupPage, projectContext, request, baseURL }) => {
      const data = getTestData(testData.signup.test1008.desktop, projectContext);
      const email = generateUniqueEmail();

      const precreate = await request.post(`${baseURL}/api/accounts`, {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email,
          phone: `+1${generateUniquePhone()}`,
          region: 'ON',
          language: projectContext.language,
          leadDistributeConsentAgreement: false,
          password: data.password,
          passwordSpecified: true,
          partner: 'nesto',
          formName: 'signup',
        },
      });
      expect(precreate.status()).toBe(201);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.fillForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: generateUniquePhone(),
        email,
        password: data.password,
        passwordConfirmation: data.password,
        region: data.region as SignupRegion,
      });
      await signupPage.submit();

      await expect(signupPage.locators.errorText(data.expectedError)).toBeVisible();
    },
  );

  test(
    'signup - test1009 - shows the correct field labels and copy',
    { tag: ['@signup', '@positive'] },
    async ({ signupPage, projectContext }) => {
      const data = getTestData(testData.signup.test1009.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));

      await expect(signupPage.locators.heading()).toHaveText(data.heading);
      await expect(signupPage.locators.firstNameInput()).toHaveAttribute(
        'placeholder',
        data.firstNamePlaceholder,
      );
      await expect(signupPage.locators.lastNameInput()).toHaveAttribute(
        'placeholder',
        data.lastNamePlaceholder,
      );
      await expect(signupPage.locators.phoneInput()).toHaveAttribute(
        'placeholder',
        data.phonePlaceholder,
      );
      await expect(signupPage.locators.regionPlaceholderOption()).toHaveText(
        data.regionPlaceholder,
      );
      await expect(signupPage.locators.emailInput()).toHaveAttribute(
        'placeholder',
        data.emailPlaceholder,
      );
      await expect(signupPage.locators.passwordInput()).toHaveAttribute(
        'placeholder',
        data.passwordPlaceholder,
      );
      await expect(signupPage.locators.passwordConfirmationInput()).toHaveAttribute(
        'placeholder',
        data.passwordConfirmationPlaceholder,
      );
      await expect(signupPage.locators.consentLabel()).toHaveText(data.consentLabel);
      await expect(signupPage.locators.submitButton()).toHaveText(data.submitButtonText);
    },
  );

  test(
    'signup - test1010 - language switcher navigates to the other locale',
    { tag: ['@signup', '@positive'] },
    async ({ signupPage, projectContext, page }) => {
      const data = getTestData(testData.signup.test1010.desktop, projectContext);

      await signupPage.goto(signupPath(projectContext.language));
      await signupPage.switchLanguage(data.switchLinkLabel);

      await expect(page).toHaveURL(new RegExp(`${data.expectedPathAfterSwitch}$`));
    },
  );
});
