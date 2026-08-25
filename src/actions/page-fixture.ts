import { test as base } from '@playwright/test';
import { parseProjectName } from '../utils/config/project-context';
import { ProjectContext } from '../utils/types/project.types';
import { DesktopSignupActions } from './desktop/desktop.signup.actions';

interface PageFixtures {
  projectContext: ProjectContext;
  signupPage: DesktopSignupActions;
  // Add one entry per page as features are built, constructing the desktop
  // implementation (swap by projectContext.device once a second device
  // exists).
}

export const test = base.extend<PageFixtures>({
  projectContext: async ({}, use, testInfo) => {
    await use(parseProjectName(testInfo.project.name));
  },

  signupPage: async ({ page }, use) => {
    await use(new DesktopSignupActions(page));
  },
});
