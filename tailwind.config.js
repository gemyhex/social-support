/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
        },
        accent: '#06b6d4',
        ui: {
          50: '#f8fafc',
          900: '#0f172a',
        },
      },
      borderRadius: { xl: '1rem' },
      spacing: { 9: '2.25rem' },
    },
  },
  plugins: [],
}
