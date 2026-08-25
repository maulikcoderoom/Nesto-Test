export enum Language {
  EN = 'en',
  FR = 'fr',
}

export enum Device {
  DESKTOP = 'desktop',
}

export enum Browser {
  CHROME = 'chrome',
}

/** Parsed from a Playwright project name, e.g. "en-desktop-chrome". */
export interface ProjectContext {
  projectName: string;
  language: Language;
  device: Device;
  browser: Browser;
}

export interface LocalizedTestData<T> {
  english: T;
  french: T;
}

/** Signup's "Province of purchase" dropdown — values match the <option>'s value attribute */
export enum SignupRegion {
  ONTARIO = 'ON',
  QUEBEC = 'QC',
  ALBERTA = 'AB',
  BRITISH_COLUMBIA = 'BC',
  MANITOBA = 'MB',
  NEW_BRUNSWICK = 'NB',
  NOVA_SCOTIA = 'NS',
  NEWFOUNDLAND_AND_LABRADOR = 'NL',
  PRINCE_EDWARD_ISLAND = 'PE',
  SASKATCHEWAN = 'SK',
  NORTHWEST_TERRITORIES = 'NT',
  YUKON = 'YT',
  NUNAVUT = 'NU',
}

/** Displayed option text per language, as observed on /signup and /fr/signup. */
export const SIGNUP_REGION_LABELS: Record<SignupRegion, LocalizedTestData<string>> = {
  [SignupRegion.ONTARIO]: { english: 'Ontario', french: 'Ontario' },
  [SignupRegion.QUEBEC]: { english: 'Quebec', french: 'Québec' },
  [SignupRegion.ALBERTA]: { english: 'Alberta', french: 'Alberta' },
  [SignupRegion.BRITISH_COLUMBIA]: { english: 'British-Columbia', french: 'Colombie-Britannique' },
  [SignupRegion.MANITOBA]: { english: 'Manitoba', french: 'Manitoba' },
  [SignupRegion.NEW_BRUNSWICK]: { english: 'New Brunswick', french: 'Nouveau-Brunswick' },
  [SignupRegion.NOVA_SCOTIA]: { english: 'Nova Scotia', french: 'Nouvelle-Écosse' },
  [SignupRegion.NEWFOUNDLAND_AND_LABRADOR]: {
    english: 'Newfoundland and Labrador',
    french: 'Terre-Neuve-et-Labrador',
  },
  [SignupRegion.PRINCE_EDWARD_ISLAND]: {
    english: 'Prince Edward Island',
    french: 'Île-du-Prince-Édouard',
  },
  [SignupRegion.SASKATCHEWAN]: { english: 'Saskatchewan', french: 'Saskatchewan' },
  [SignupRegion.NORTHWEST_TERRITORIES]: {
    english: 'Northwest Territories',
    french: 'Territoires du Nord-Ouest',
  },
  [SignupRegion.YUKON]: { english: 'Yukon', french: 'Yukon' },
  [SignupRegion.NUNAVUT]: { english: 'Nunavut', french: 'Nunavut' },
};
