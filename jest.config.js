const tsPreset = require('ts-jest');

module.exports = {
    ...tsPreset.jestPreset,
    moduleNameMapper: {
        '@browser-storage/core': '<rootDir>/packages/core/src/index.ts',
        '@browser-storage/localstorage-driver': '<rootDir>/packages/localstorage-driver/src/index.ts',
        '@browser-storage/sessionstorage-driver': '<rootDir>/packages/sessionstorage-driver/src/index.ts'
    }
};