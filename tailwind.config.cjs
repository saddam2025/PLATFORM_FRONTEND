// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Map design tokens to Tailwind color keys
        'brand-50': 'var(--brand-50)',
        'brand-100': 'var(--brand-100)',
        'brand-200': 'var(--brand-200)',
        'brand-500': 'var(--brand-500)',
        'brand-700': 'var(--brand-700)',

        'surface-canvas': 'var(--bg-canvas)',
        'surface-default': 'var(--surface-default)',
        'surface-muted': 'var(--surface-muted)',
        'surface-border': 'var(--surface-border)',

        'sidebar-bg': 'var(--sidebar-bg)',

        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)'
        },

        success: {
          DEFAULT: 'var(--success-DEFAULT)'
        },
        danger: {
          DEFAULT: 'var(--danger-DEFAULT)'
        },
        info: {
          DEFAULT: 'var(--info-DEFAULT)'
        }
      },

      boxShadow: {
        // Floating depth effect (lighter in light mode, stronger in dark via CSS tokens)
        floating: 'var(--shadow-floating)',
        card: 'var(--shadow-card)'
      },

      transitionDuration: {
        '400': '400ms'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },

      animation: {
        fadeIn: 'fadeIn 0.25s cubic-bezier(0.4,0,0.2,1) both'
      }
    }
  },
  plugins: []
};
