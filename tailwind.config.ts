import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        muted: 'var(--muted)',
        card: 'var(--card)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        brand: 'var(--brand)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)']
      },
      borderRadius: {
        md: '12px',
        lg: '20px'
      },
      boxShadow: {
        subtle: '0 10px 30px rgba(25, 30, 50, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
