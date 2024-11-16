/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Share Tech Mono', 'ui-sans-serif', 'system-ui'],
      'headers': ['Share Tech Mono', 'ui-sans-serif', 'system-ui']
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
    extend: {
      boxShadow: {
        'soft-lg': '0 15px 35px rgba(0, 0, 0, 0.15)',
        'cta-hover': '0 20px 45px rgba(67, 56, 202, 0.35)'
      },
      letterSpacing: {
        'wide-extra': '0.08em'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        customtransparent: {
          "primary": "#570DF8", // Example primary color
          "secondary": "#F000B8", // Example secondary color
          "accent": "#37CDBE", // Example accent color
          "neutral": "#3D4451", // Example neutral color
          "base-100": "rgba(0,0,0,0)", // Transparent background
          "--tw-bg-opacity": "0", // Force opacity to 0
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",

        },
      },
      "black",
      "nord",
    ],
    darkMode: ['selector', '[data-theme="black"]']
  },
}
