/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './views/*.{html,js,ejs}',
    './views/admin/*.{html,js,ejs}',
    'node_modules/preline/dist/*.js',
    './views/user/*.{html,js,ejs}'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('preline/plugin')],
}

