/** @type {import('tailwindcss').Config} */

const { addDynamicIconSelectors } = require('@iconify/tailwind');

module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './src/*.html',
    './src/**/*.html',
    './src/**/*.ts',
    './src/**/*.scss',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    addDynamicIconSelectors(),
  ],
}

