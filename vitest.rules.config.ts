import { defineConfig } from 'vitest/config';

// Security-rules tests: they talk to the Firebase emulators, so they run separately from `npm test`
// (see `npm run test:rules`, which starts the emulators first).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/rules/**/*.test.ts'],
    // The test files share one emulator instance.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
