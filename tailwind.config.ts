/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'wave-slow': 'wave-1 15s ease-in-out infinite',
        'wave-medium': 'wave-2 12s ease-in-out infinite',
        'wave-fast': 'wave-3 10s ease-in-out infinite',
      },
      keyframes: {
        'wave-1': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10%)' },
        },
        'wave-2': {
          '0%, 100%': { transform: 'translateY(10%)' },
          '50%': { transform: 'translateY(-10%)' },
        },
        'wave-3': {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(5%)' },
        }
      }
    }
  },
  plugins: [],
};
