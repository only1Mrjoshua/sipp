/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Color Palette
      colors: {
        primary: {
          light: '#9FE7F5',
          DEFAULT: '#429EBD',
          dark: '#053F5C',
        },
        accent: {
          yellow: '#F7AD19',
          orange: '#F27F0C',
        },
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
        },
      },
      
      // Typography
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      
      // Container Widths
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      
      // Breakpoints
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      
      // Border Radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      
      // Shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 12px 30px -4px rgba(0, 0, 0, 0.05)',
        'strong': '0 8px 30px -4px rgba(0, 0, 0, 0.10), 0 20px 40px -8px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 40px rgba(66, 158, 189, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.06), 0 12px 32px rgba(0, 0, 0, 0.08)',
      },
      
      // Transitions
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      
      // Animation
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'count-up': 'countUp 0.8s ease-out forwards',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        slideUp: {
          '0%': { 
            opacity: 0,
            transform: 'translateY(30px)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { 
            opacity: 0,
            transform: 'scale(0.9)',
          },
          '100%': { 
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        countUp: {
          '0%': { 
            opacity: 0,
            transform: 'translateY(10px) scale(0.9)',
          },
          '100%': { 
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
        },
      },
      
      // Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '58': '14.5rem',
        '66': '16.5rem',
        '74': '18.5rem',
        '82': '20.5rem',
        '90': '22.5rem',
        '98': '24.5rem',
      },
      
      // Typography Scale
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // Font Weights
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [
    // Typography plugin for markdown content
    // require('@tailwindcss/typography'),
    // Forms plugin for better form styling
    // require('@tailwindcss/forms'),
  ],
};