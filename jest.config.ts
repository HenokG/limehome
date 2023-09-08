import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/__tests__/**/*.[jt]s'],
  setupFiles: ['./test/test-setup.ts'],
  setupFilesAfterEnv: ['./test/test-setup-after-env.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};

export default config;
