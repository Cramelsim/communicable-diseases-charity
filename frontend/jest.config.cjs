module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // import.meta is not available under Jest, so config is swapped for a stub.
    '^(\\.\\./)+config$': '<rootDir>/src/__mocks__/config.js',
    '\\.(css)$': 'identity-obj-proxy',
  },
  testMatch: ['**/*.test.{js,jsx}'],
};
