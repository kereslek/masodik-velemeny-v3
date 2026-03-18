import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(173, 80%, 40%)',
        'primary-light': 'hsl(173, 80%, 96%)',
        'primary-dark': 'hsl(173, 80%, 30%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'health': '0 8px 30px rgb(0,0,0,0.06)',
        'health-lg': '0 16px 50px rgb(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
