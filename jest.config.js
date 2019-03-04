const tsPreset = require('ts-jest');

module.exports = {
  ...tsPreset.jestPreset,
  modulePathIgnorePatterns: [
    '<rootDir>/packages/core/pkg/',
    '<rootDir>/packages/localstorage-driver/pkg/',
    '<rootDir>/packages/sessionstorage-driver/pkg/',
    '<rootDir>/packages/websql-driver/pkg/',
    '<rootDir>/packages/indexeddb-driver/pkg/',
    '<rootDir>/packages/typings/pkg/'
  ]
};
