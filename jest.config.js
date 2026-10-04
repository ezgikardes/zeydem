/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': '<rootDir>/tests/mocks/styleMock.cjs',
    '\\.(png|jpe?g|gif|svg|webp|avif|ico|woff2?)$': '<rootDir>/tests/mocks/fileMock.cjs',
  },
};
