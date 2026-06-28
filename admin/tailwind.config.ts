import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.vue',
    './components/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#141414',
        card: '#1c1c1c',
        border: '#2a2a2a',
        accent: '#f5c518',
        'accent-dark': '#c49a10',
        muted: '#666666',
        'muted-light': '#999999',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
} satisfies Config
