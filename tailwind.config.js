const { guessProductionMode } = require('@ngneat/tailwind');

process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  purge: ['./src/**/*.{html,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        // xs:w-10で、480px幅以上で、w-10のスタイルが適用されるようになる
        xs: '600px'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
