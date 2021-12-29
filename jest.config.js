module.exports = {
  modulePathIgnorePatterns: ['__mocks__'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/test/**/*.test.[jt]s?(x)',
    // "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  testURL: 'http://localhost',
};
