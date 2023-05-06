module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["lemonade"]
  },
  theme: {
    extend: {
      boxShadow: {
        '4xl': '10px 35px 75px -15px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['responsive', 'hover', 'focus', 'active'],
    },
  },
}
