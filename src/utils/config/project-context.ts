import {
  Browser,
  Device,
  Language,
  LocalizedTestData,
  ProjectContext,
} from '../types/project.types';

/**
 * Derives language/device/browser from a Playwright project name
 * (e.g. "en-desktop-chrome", matching configs/projects/*.config.ts).
 */
export function parseProjectName(projectName: string): ProjectContext {
  const [language, device, browser] = projectName.split('-');
  if (!language || !device || !browser) {
    throw new Error(
      `Invalid project name "${projectName}", expected "<language>-<device>-<browser>"`,
    );
  }

  return {
    projectName,
    language: language as Language,
    device: device as Device,
    browser: browser as Browser,
  };
}

/**
 * Picks the test data for the running project's language out of a EN/FR
 * getTestData(testData.signup.test1001.desktop, projectContext).
 */
export function getTestData<T>(data: LocalizedTestData<T>, context: ProjectContext): T {
  return context.language === Language.FR ? data.french : data.english;
}
