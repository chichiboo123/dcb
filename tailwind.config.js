/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard GOV"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        // KRDS 기반 + 어린이 친화 파스텔 팔레트
        krds: {
          primary: '#0F4C9A',
          secondary: '#296DF0',
          point: '#FF6B35',
          bg: '#F5F7FB',
          line: '#D6DBE4',
          text: '#1F2937',
        },
        pastel: {
          blue: '#BFDBFE',
          pink: '#FBCFE8',
          green: '#BBF7D0',
          yellow: '#FEF3C7',
          peach: '#FED7AA',
          mint: '#A7F3D0',
          lavender: '#DDD6FE',
        },
        kraft: {
          50: '#FBF5E9',
          100: '#F2E4C4',
          200: '#E6CD96',
          300: '#D4B16A',
          400: '#B58A45',
          500: '#8B6A36',
          600: '#5E4825',
        },
      },
      boxShadow: {
        'box-3d': '0 30px 60px -15px rgba(94, 72, 37, 0.45), 0 10px 20px -5px rgba(94, 72, 37, 0.3)',
        'paper': '0 2px 4px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        'invoice': '0 6px 12px rgba(0,0,0,0.10), 0 18px 30px rgba(0,0,0,0.08)',
      },
      keyframes: {
        wiggle: {
          '0%,100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1.6s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
