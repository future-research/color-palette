module.exports = {
  preset: 'ts-jest',
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '\\.(test|spec).(ts|tsx|js)$',
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text'],
  restoreMocks: true,

  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2020',
      },
      diagnostics: {
        ignoreCodes: ['TS2345'],
      },
    },
  },
}
