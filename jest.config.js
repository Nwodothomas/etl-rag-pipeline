// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Map module paths if you use @/ imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Load setup file so matchers like toBeInTheDocument work
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Optional: ignore build output
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};