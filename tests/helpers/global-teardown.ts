// Runs once after the whole suite (all projects). Use for one-time cleanup
// of resources created in global-setup.ts (not per-test data — that belongs
// in the owning fixture's teardown or test.afterEach/afterAll).
async function globalTeardown(): Promise<void> {}

export default globalTeardown;
