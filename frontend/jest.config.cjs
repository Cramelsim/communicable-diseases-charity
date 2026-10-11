module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: { '\\.(css)$': 'identity-obj-proxy' },
  testTimeout: 20000,
  testMatch: ['**/*.test.{js,jsx}'],
};
