export default {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(int.test).+(ts)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
}
