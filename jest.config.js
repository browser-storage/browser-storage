const tsPreset = require('ts-jest');

module.exports = {
    ...tsPreset.jestPreset,
    moduleNameMapper: {
        '@browser-storage/core': '<rootDir>/packages/core/src/index.ts',
        '@browser-storage/localstorage-driver': '<rootDir>/packages/localstorage-driver/src/index.ts',
        '@browser-storage/sessionstorage-driver': '<rootDir>/packages/sessionstorage-driver/src/index.ts',
        '@browser-storage/websql-driver': '<rootDir>/packages/websql-driver/src/index.ts',
        '@browser-storage/indexeddb-driver': '<rootDir>/packages/indexeddb-driver/src/index.ts'
    }
};