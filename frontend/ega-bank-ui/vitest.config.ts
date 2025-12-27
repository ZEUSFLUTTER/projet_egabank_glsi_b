import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.spec.ts'],
        setupFiles: ['src/test-setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/app/**/*.ts'],
            exclude: [
                'src/app/**/*.spec.ts',
                'src/app/**/*.module.ts',
                'src/main.ts',
                'src/environments/**'
            ]
        },
        deps: {
            inline: [/@angular/]
        }
    }
});
