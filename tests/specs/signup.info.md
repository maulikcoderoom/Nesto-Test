# Signup

## Test cases

| #        | Case                                                                                                                           | Tags                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| test1001 | Valid signup with all fields → `201`, redirect off `/signup`, response reflects submitted data                                 | `@signup @positive @smoke @api`      |
| test1002 | Valid signup with consent checkbox left unchecked → still succeeds                                                             | `@signup @positive @regression`      |
| test1003 | Empty form submit → required/invalid errors for first name, last name, phone, email, password                                  | `@signup @negative @regression`      |
| test1004 | Invalid email format → "Invalid email"                                                                                         | `@signup @negative @regression`      |
| test1005 | Password under 12 characters → "Minimum of 12 letters required"                                                                | `@signup @negative @regression`      |
| test1006 | Password missing uppercase/lowercase/number (but ≥12 chars) → distinct complexity error, only surfaced on submit (not on blur) | `@signup @negative @regression`      |
| test1007 | Confirm password mismatch → "Passwords do not match"                                                                           | `@signup @negative @regression`      |
| test1008 | Duplicate email (pre-created via a direct `POST /api/accounts` call) → generic error shown                                     | `@signup @negative @regression @api` |
| test1009 | Field/label/copy coverage — heading, every field's placeholder, consent text, submit button, in both languages                 | `@signup @positive @regression`      |
| test1010 | Language switcher — `FR`/`EN` link navigates between `/signup` and `/fr/signup`                                                | `@signup @positive @regression`      |

All ten run against both `en-desktop-chrome` and `fr-desktop-chrome` (full parity, by design — see Notes).

## Environment

- `BASE_URL` (default: QA, `https://app.qa.nesto.ca`) — override for dev/staging.
- Run both languages: `npx playwright test tests/specs/signup.spec.ts`
- Run one language: `npx playwright test tests/specs/signup.spec.ts --project=en-desktop-chrome` (or `fr-desktop-chrome`)

## Assumptions

- Email and phone are generated fresh per test run (`generateUniqueEmail()` / `generateUniquePhone()` in `src/utils/`) rather than stored in `test-data.json`, since there's no API to delete an account after creation — a static value would collide with a prior run's account on every rerun.
- The password-complexity check (uppercase/lowercase/number) only fires on submit, not on field blur — confirmed by direct testing; the length check (`Minimum of 12 letters required`) fires on both blur and submit. All negative-path tests here trigger validation via submit for consistency.
- test1008 pre-creates the "already registered" account via a direct `POST /api/accounts` call (using Playwright's `request` fixture) rather than through the UI, to keep the test focused and fast; the minimal payload used was verified directly against the QA API before being adopted here.
- Region defaults to "Ontario" on load and isn't required to change it for any case here, so no test drives the province select.
- The phone-country selector defaults to Canada; not exercised since no case needs a non-Canadian number.

## Bugs / anomalies found

- **Duplicate email doesn't say so.** Submitting an already-registered email returns `400 {"error":"bad format","description":"error creating account"}`, and the UI shows a generic "Something went wrong! Please try again..." message rather than anything indicating the email is taken. This may be intentional (avoids account-enumeration), but it's a poor user experience if not — worth confirming intent with product. Test1008 asserts the generic message, not a duplicate-specific one, since that's the current actual behavior.
- **Password complexity requirement isn't surfaced until submit.** The static helper text under the password field states the uppercase/lowercase/number requirement, but nothing indicates it's unmet until the user clicks "Create your account" — no live/blur feedback like the length check gets. Minor UX inconsistency, not treated as a blocking bug.
- **Heading hierarchy skips `<h1>`.** The page's only heading ("Create a nesto account") is an `<h2>`; there's no `<h1>` anywhere on the page. Minor accessibility/SEO issue (screen readers and crawlers expect a page to start at `h1`) — worth a quick fix, low severity.

## Notes / tracking

- Exploration created several disposable QA accounts (`qa-explore-*@mailinator.com`, and `qa-signup-*@mailinator.com` from subsequent full suite runs) — expected, since there's no delete API and this is how the account-creation contract had to be observed/verified. Every suite run going forward will also create 2 new accounts (test1001, test1002) plus 2 more via the API pre-create in test1008, ×2 languages = 6 accounts per full run.
- A successful signup redirects to `/getaquote/callback?code=...&state=...` (an OAuth-style handoff into a separate "get a quote" flow) — out of scope for this suite; test1001 only asserts the URL is no longer `/signup`, not the destination's content.
- Full en/fr parity (all 10 cases in both languages) was a deliberate choice after discussing the tradeoff (duplicating validation-logic tests across languages vs. a trimmed localization-only subset) — the team chose full parity.
