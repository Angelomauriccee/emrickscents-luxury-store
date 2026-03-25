import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        content: '1400px',
      },
      spacing: {
        'section-y': '120px',
        'section-y-md': '80px',
        'section-y-sm': '60px',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        ui: ['DM Sans', 'system-ui', 'sans-serif'],
        label: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
