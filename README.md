# Nesto Test

Playwright + TypeScript end-to-end tests for [app.qa.nesto.ca](https://app.qa.nesto.ca) (QA by default). This README covers day-to-day usage for someone new to the repo.

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
```

Every test also runs headed (a real Chrome window opens) by default — see `playwright.config.ts` if you want to change that locally.

Other useful ways to run it:

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

## 3. Check results

- **While a run is in progress**: the terminal prints a live pass/fail line per test (the `list` reporter).
- **After a run**: an HTML report is generated automatically. Open the most recent one with:

  ```bash
  npm run test:report
  ```

  It opens in your browser and shows every test's status, and for any failure: the error, a screenshot, a video, and (on CI retries) a trace you can step through.

- **Raw output**: `test-results/` holds the raw per-test artifacts (screenshots, videos) behind the HTML report; `playwright-report/` is the report itself. Both are git-ignored — don't hand-edit them, they're regenerated every run.
- **Suite notes**: `tests/specs/signup.info.md` documents the approved test cases, known assumptions, and any bugs found while building the suite.

## 4. Other commands

```bash
npm run typecheck      # tsc --noEmit — must be clean
npm run lint           # eslint .    — must be clean
npm run lint:fix       # eslint . --fix — auto-fixes what it can
npm run format         # prettier --write . — reformats the repo
npm run format:check   # prettier --check . — verifies formatting without changing files
```

All four should be clean before considering a change done.

Other Playwright commands you'll likely use while writing new tests:

```bash
npx playwright codegen https://app.qa.nesto.ca/signup   # record actions into a test as you click through the page
npx playwright show-report                              # same as npm run test:report
npx playwright install                                   # (re)install browser binaries after a Playwright upgrade
```

## Project structure at a glance

```
configs/projects/   Playwright project configs (one per language/device/browser)
src/                page objects: locators, actions, and the test fixture wiring
tests/specs/        the actual test files (<feature>.spec.ts + <feature>.info.md)
tests/data/         test data (tests/data/test-data.json)
tests/helpers/      one-time global setup/teardown
```

New suites follow the same layout: a spec file plus a matching `.info.md` under `tests/specs/`, page objects (locators + actions) under `src/`, and test data under `tests/data/`.
