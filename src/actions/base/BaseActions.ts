import { Locator, Page } from '@playwright/test';

/**
 * Generic, page-agnostic interactions. Every base.<page>.actions.ts extends
 * this so per-page action classes don't re-implement click/fill/etc. —
 */
export abstract class BaseActions {
  constructor(protected readonly page: Page) {}

  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  protected async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  protected async check(locator: Locator): Promise<void> {
    await locator.check();
  }

  protected async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
