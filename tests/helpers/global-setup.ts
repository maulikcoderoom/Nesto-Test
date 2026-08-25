// Runs once before the whole suite (all projects), independent of any test
// worker. Use for one-time setup: e.g. logging in and saving storageState
// under playwright/.auth/ once auth is needed, instead of per-test login.
async function globalSetup(): Promise<void> {}

export default globalSetup;
