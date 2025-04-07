import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // Use 'v8' as the coverage provider
      reporter: ['text', 'html'], // 'text' for terminal output, 'html' for an HTML report
      exclude: [
        'node_modules/**', // Exclude node_modules from coverage
        'tests/**',         // Exclude test files
      ],
    },
    globals: true, // Ensure globals like `expect` are available
    environment: 'jsdom', // Ensure the correct test environment
  },
});
