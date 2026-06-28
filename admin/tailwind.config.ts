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
        bg: '#0f0800',
        surface: '#1a0e05',
        card: '#1e1208',
        border: '#2a1a0a',
        accent: '#d4873c',
        'accent-dark': '#7a3d0e',
        muted: '#555',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
} satisfies Config
