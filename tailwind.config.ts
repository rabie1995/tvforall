import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary palette - Deep navy theme
        background: '#0B0F19',
        surface: '#111827',
        'surface-light': '#1F2937',
        primary: '#2563EB', // Royal blue
        secondary: '#22C55E', // Green trust signal
        accent: '#F59E0B', // Orange warning/promo
        text: '#E5E7EB', // Primary text
        'text-muted': '#9CA3AF', // Muted text
        border: '#1F2937',
        // Legacy colors for compatibility
        navy: '#0F172A',
        teal: '#06B6D4',
        tealDark: '#0EA5A3',
        orange: '#F97316',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Kufi Arabic"', '"Cairo"', 'Inter', 'sans-serif']
      },
      boxShadow: {
        card: '0 15px 50px rgba(15, 23, 42, 0.12)',
        'card-hover': '0 25px 60px rgba(37, 99, 235, 0.15)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.3)',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(37, 99, 235, 0.6)' },
        },
      },
    }
  },
  plugins: [forms]
};

export default config;
