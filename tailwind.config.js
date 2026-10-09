/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        },
        slate: {
          850: '#111827',
          950: '#030712',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'flash-crimson': 'flashCrimson 1.2s infinite',
      },
      keyframes: {
        flashCrimson: {
          '0%, 100%': { backgroundColor: 'rgba(225, 29, 72, 0.15)', borderColor: 'rgba(225, 29, 72, 0.8)' },
          '50%': { backgroundColor: 'rgba(225, 29, 72, 0.35)', borderColor: 'rgba(244, 63, 94, 1)' },
        }
      }
    },
  },
  plugins: [],
}
