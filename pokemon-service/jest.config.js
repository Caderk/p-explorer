// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/src/tests/**/*.test.(ts|js)'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json'
      }
    }
  };
  