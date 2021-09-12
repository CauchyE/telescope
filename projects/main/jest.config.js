require('jest-preset-angular/ngcc-jest-processor');

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/projects/main/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/projects/main/cypress/']
};
