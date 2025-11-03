/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e6efff',
          300: '#7da9ff',
          500: '#2563eb', // primary
          600: '#1e40af',
        },
        ui: {
          bg: '#f8fafb',
          surface: '#ffffff',
          muted: '#64748b',
        },
        darkui: {
          bg: '#0f1724',
          surface: '#0b1220',
          muted: '#94a3b8',
        },
      },
      boxShadow: {
        glass: '0 8px 30px rgba(16,24,40,0.08)',
        'glass-dark': '0 8px 30px rgba(2,6,23,0.6)',
      },
      borderRadius: {
        'xl-2': '14px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
