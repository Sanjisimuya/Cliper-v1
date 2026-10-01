/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        surface: {
          DEFAULT: "#12141c",
          elevated: "#181b26",
          border: "#23283a",
          highlight: "#2e344d"
        },
        brand: {
          cyan: "#00f0ff",
          emerald: "#10b981",
          violet: "#8b5cf6",
          pink: "#ff007f",
          amber: "#f59e0b"
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
        'bounce-subtle': 'bounceSubtle 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.6)' },
        },
        bounceSubtle: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-3px)' },
        }
      }
    },
  },
  plugins: [],
};
