const plugin = require('tailwindcss/plugin');

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
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#347A53',
          600: '#2A6343',
          900: '#14532d',
        },
        sage: {
          50: '#F5F7F0',
          100: '#E8EFDF',
          200: '#E2EBD9',
          300: '#D4E4D0',
          400: '#DCE5D9',
          500: '#77A985',
          600: '#347A53',
          700: '#2A6343',
          800: '#26382D',
          900: '#1B2920',
          muted: '#69776C',
        },
        navy: {
          950: '#0E141B',
          900: '#111820',
          850: '#182431',
          800: '#192330',
          750: '#202D3D',
          700: '#273648',
          600: '#354456',
          border: '#354456',
          text: '#E8EEF5',
          muted: '#A6B3C1',
          emerald: '#36B879',
          amber: '#E0B34E',
          crimson: '#E45B63',
          blue: '#4B91D9',
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
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('theme-light', ['.theme-light &', '.theme-light&', '[data-theme="light"] &', '[data-theme="light"]&']);
      addVariant('theme-slate', ['.theme-slate &', '.theme-slate&', '[data-theme="slate"] &', '[data-theme="slate"]&']);
    }),
  ],
}
