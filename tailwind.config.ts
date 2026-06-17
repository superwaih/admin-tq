import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0F1117',
          2: '#4A4D5A',
          3: '#8A8D99',
          4: '#C2C4CC',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F6F7F9',
          3: '#EDEEF2',
        },
        brand: {
          DEFAULT: '#2D5BE3',
          dim: '#EEF2FD',
          mid: '#7B9EF0',
          dark: '#1F46C0',
        },
        emerald: {
          DEFAULT: '#0D9B6A',
          dim: '#E3F6EF',
        },
        saffron: {
          DEFAULT: '#D97706',
          dim: '#FEF3C7',
        },
        rose: {
          DEFAULT: '#DC2626',
          dim: '#FEE2E2',
        },
        violet: {
          DEFAULT: '#7C3AED',
          dim: '#EDE9FE',
        },
        teal: {
          DEFAULT: '#0891B2',
          dim: '#E0F2FE',
        },
        canvas: '#0D0F16',
        // shadcn/ui semantic tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        'r-sm': '6px',
        'r-md': '10px',
        'r-lg': '14px',
        'r-xl': '20px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
        '3xs': ['9px', { lineHeight: '1.3' }],
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(5px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { outlineWidth: '3px', outlineColor: 'rgba(45,91,227,0.2)' },
          '50%': { outlineWidth: '5px', outlineColor: 'rgba(45,91,227,0.08)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'dot-bounce': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
        'toast-slide-in': {
          from: { transform: 'translateX(110%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'progress-fill': {
          from: { width: '0%' },
          to: { width: 'var(--progress-width, 0%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        glow: 'glow 2s infinite',
        pulse: 'pulse 2s infinite',
        'dot-bounce': 'dot-bounce 1.2s infinite',
        'toast-slide-in': 'toast-slide-in 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        card: '0 1px 4px rgba(15,17,23,0.06)',
        'card-hover': '0 2px 12px rgba(15,17,23,0.10)',
        brand: '0 3px 10px rgba(45,91,227,0.3)',
        'brand-lg': '0 6px 24px rgba(45,91,227,0.4)',
        drawer: '-16px 0 50px rgba(0,0,0,0.18)',
        toast: '0 6px 24px rgba(0,0,0,0.35)',
        modal: '0 20px 60px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
