/**
 * YatraMitra AI — design tokens
 * -----------------------------------------------------------------
 * Palette: "dusk-to-marigold" — a deep indigo night sky (brand) paired
 * with a marigold/saffron accent (festive, distinctly Indian, warmer
 * and more yellow than a generic terracotta) and a jade secondary used
 * only for sustainability/local-economy signals. Light mode uses a cool
 * stone background (not cream) so the saffron accent pops in both themes.
 */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef1f9',
          100: '#d6ddf0',
          200: '#adbae1',
          300: '#7f92cd',
          400: '#546bb3',
          500: '#374d91',
          600: '#2b3d75',
          700: '#22305c',
          800: '#1b2a4a',
          900: '#111a30',
          950: '#0a0f1c',
        },
        saffron: {
          50: '#fff8ec',
          100: '#ffedc7',
          200: '#ffd685',
          300: '#ffbc4d',
          400: '#f9a93f',
          500: '#f4a93b',
          600: '#d98620',
          700: '#b3661a',
          800: '#8f501c',
          900: '#753f1b',
        },
        jade: {
          50: '#ecfbf5',
          100: '#d1f5e5',
          200: '#a5ebcd',
          300: '#6fdab0',
          400: '#3cc293',
          500: '#1f9d77',
          600: '#177e60',
          700: '#15654e',
          800: '#144f40',
          900: '#124136',
        },
        stone: {
          25: '#fbfbfa',
          50: '#f4f6f8',
          100: '#e9ecf1',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
        control: '0.75rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(10, 15, 28, 0.12)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        glass: '16px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(4%, -6%) scale(1.08)' },
          '66%': { transform: 'translate(-3%, 4%) scale(0.96)' },
        },
        'aurora-reverse': {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(-5%, 5%) scale(1.05)' },
          '66%': { transform: 'translate(3%, -4%) scale(0.98)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        'aurora-reverse': 'aurora-reverse 22s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
      },
    },
  },
  plugins: [],
};
