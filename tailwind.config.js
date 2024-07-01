/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  variants: {
    extend: {
      display: ['print'],
    },
  },
  theme: {
    fontFamily:{
      sans: 'Roboto Mono, monospace',
    },
   
    extend: { colors:{
      pizza:"#123456"
    },
  height:{
    screen: '100dvh'
  },
  scrollbarHide: {
    'scrollbar-hide': 'scrollbar-width: none; -ms-overflow-style: none;',
  },
  },
  },
  plugins: [ function ({ addUtilities }) {
    addUtilities({
      '.scrollbar-hide': {
        'scrollbar-width': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    })
  }],
}