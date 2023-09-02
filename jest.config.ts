import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  automock: false,
  resetMocks: false,
  setupFiles: ['./test/setupJest.ts'],
};

export default config;
