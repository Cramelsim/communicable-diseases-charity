module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: { '\\.(css)$': 'identity-obj-proxy' },
  testMatch: ['**/*.test.{js,jsx}'],
};
