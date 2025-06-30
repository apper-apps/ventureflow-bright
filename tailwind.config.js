/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE5',
        secondary: '#1E1B3A',
        accent: '#00D4AA',
        surface: '#FFFFFF',
        background: '#F8F9FC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B4FE5 0%, #00D4AA 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(91, 79, 229, 0.1) 0%, rgba(0, 212, 170, 0.1) 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FC 100%)',
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(91, 79, 229, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'elevated': '0 8px 32px rgba(91, 79, 229, 0.2)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}