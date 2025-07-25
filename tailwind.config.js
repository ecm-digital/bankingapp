/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a3f6',
          500: '#0c87e8',
          600: '#0069c5',
          700: '#0054a0',
          800: '#004784',
          900: '#00356d',
        },
        secondary: {
          green: '#059669',
          orange: '#ea580c',
          red: '#dc2626',
        },
        status: {
          blue: {
            100: '#dbeafe',
            800: '#1e40af',
          },
          green: {
            100: '#dcfce7',
            500: '#22c55e',
            800: '#166534',
          },
          purple: {
            100: '#f3e8ff',
            800: '#6b21a8',
          },
          yellow: {
            100: '#fef3c7',
            800: '#92400e',
          },
          red: {
            500: '#ef4444',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}