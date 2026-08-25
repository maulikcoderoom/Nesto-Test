import { devices, type Project } from '@playwright/test';

/**
 * French / desktop / Chrome. Project name encodes language-device-browser
 * and is parsed at runtime by src/utils/config/project-context.ts.
 */
const config: Project = {
  name: 'fr-desktop-chrome',
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chrome',
    baseURL: process.env.BASE_URL ?? 'https://app.qa.nesto.ca',
  },
};

export default config;
