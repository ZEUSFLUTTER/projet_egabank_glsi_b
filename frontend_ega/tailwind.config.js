/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                gray: {
                    25: '#FCFCFD',
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                brand: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',  // Primary blue
                    700: '#1d4ed8',  // Darker blue for hover
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                // Additional accent colors for banking UI
                emerald: {
                    50: '#ECFDF5',
                    500: '#10B981',
                    600: '#059669',
                },
                teal: {
                    50: '#F0FDFA',
                    500: '#14B8A6',
                    600: '#0D9488',
                }
            }
        },
    },
    plugins: [],
}
