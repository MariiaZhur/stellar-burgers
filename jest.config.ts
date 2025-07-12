import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true // Ускоряет тесты
      }
    ]
  },

  // необходимые алиасы:
  moduleNameMapper: {
    '@api': '<rootDir>/src/utils/burger-api.ts'
  }
};

export default config;
