/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00FF99',
        'dark-bg': '#0A0A0A',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
        'code-bg': '#0D1117',
        'code-border': '#21262D',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'typewriter': 'typewriter 4s steps(40) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FF99, 0 0 10px #00FF99, 0 0 15px #00FF99' },
          '100%': { boxShadow: '0 0 10px #00FF99, 0 0 20px #00FF99, 0 0 30px #00FF99' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        typewriter: {
          '0%, 50%': { content: '"World"' },
          '51%, 100%': { content: '"Future"' },
        },
      },
    },
  },
  plugins: [],
};