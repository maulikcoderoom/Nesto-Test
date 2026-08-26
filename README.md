# Nesto Test

Playwright + TypeScript end-to-end tests for [app.qa.nesto.ca](https://app.qa.nesto.ca) (QA by default). This README covers day-to-day usage for someone new to the repo.


## Assumptions

- This automation architecture is built so the nesto web application can be tested across different viewports (desktop today; the `src/actions` and `src/locators` split already reserves a `desktop` folder for viewport-specific overrides) and both English and French locales.
- Common locators and actions live in base classes (`src/actions/base/`, `src/locators/base/`) and are inherited/extended by viewport-specific implementations (`src/actions/desktop/`, `src/locators/desktop/`), so a single set of selectors and interactions is shared across variants instead of duplicated.
- Language is not handled via environment variables — it's modeled as a separate Playwright **project** per language/device/browser combo (`configs/projects/en-desktop-chrome.config.ts`, `fr-desktop-chrome.config.ts`), and tests read the active locale from `projectContext` at runtime.
- Tests are tagged so specific categories/scenarios can be filtered and run independently, e.g. `npx playwright test --grep @api`.
- The suite targets QA (`app.qa.nesto.ca`) by default; `BASE_URL` can override this to point at other environments (dev/staging).


## 1. Install

Prerequisites: Node.js (LTS) and npm.

```bash
git clone <repo-url>
cd Nesto-Test
npm install
npx playwright install
```

`npm install` installs the project's dependencies (Playwright, TypeScript, ESLint, Prettier). `npx playwright install` downloads the browser binaries Playwright drives (Chrome, Firefox, etc.) — required once, and again whenever `@playwright/test` is upgraded.

## 2. Run the signup suite (English & French)

Language isn't an environment variable in this repo — it's a Playwright **project**: `en-desktop-chrome` and `fr-desktop-chrome` (see `configs/projects/`). Running with no `--project` flag runs **both**.

```bash
# Both languages
npx playwright test tests/specs/signup.spec.ts

# English only
npx playwright test tests/specs/signup.spec.ts --project=en-desktop-chrome

# French only
npx playwright test tests/specs/signup.spec.ts --project=fr-desktop-chrome


# Check results
npx playwright show-report
```

```bash
# Run the whole suite (all spec files, both languages)
npm test

# Run just one test case by name
npx playwright test -g "test1001"

# Run against dev/staging instead of QA
BASE_URL=https://app.dev.nesto.ca npx playwright test tests/specs/signup.spec.ts --project=en-desktop-chrome

# Step through a test in the Playwright inspector
npx playwright test tests/specs/signup.spec.ts --project=en-desktop-chrome --debug
```

## 3. Other commands

```bash
npm run typecheck      # tsc --noEmit — must be clean
npm run lint           # eslint .    — must be clean
npm run lint:fix       # eslint . --fix — auto-fixes what it can
npm run format         # prettier --write . — reformats the repo
npm run format:check   # prettier --check . — verifies formatting without changing files
```


## Project structure at a glance

```
configs/projects/   Playwright project configs (one per language/device/browser)
src/                page objects: locators, actions, and the test fixture wiring
tests/specs/        the actual test files (<feature>.spec.ts + <feature>.info.md)
tests/data/         test data (tests/data/test-data.json)
tests/helpers/      one-time global setup/teardown
```

## Bugs found

- **Duplicate email doesn't say so.** Submitting an already-registered email returns `400 {"error":"bad format","description":"error creating account"}`, and the UI shows a generic "Something went wrong! Please try again..." message rather than anything indicating the email is taken. This may be intentional, but it's a poor user experience.

- **Burger menu fires an unnecessary `/api/account` call on mobile.** In the mobile viewport, clicking the burger icon triggers a `GET https://app.qa.nesto.ca/api/account` request. This call should only fire for a logged-in user, but it's being triggered from the signup page, where no user session exists.