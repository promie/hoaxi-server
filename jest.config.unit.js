export default {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(unit.test).+(ts)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
}
