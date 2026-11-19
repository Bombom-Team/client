/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(avif|jpg|jpeg|gif|png|webp|woff2?|eot|ttf|otf)$':
      '<rootDir>/src/mocks/fileMock.cjs',
  },
  testEnvironment: 'jsdom',
};

module.exports = config;
