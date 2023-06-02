/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	  './src/**/*.js',
	  './src/routes/components/*.js',
  ],
  theme: {
	fontFamily: {
		'sans': ['Roboto'],
	},
    extend: {
		colors: {
			'pink': '#ff005c',
		},
	},
  },
  plugins: [],
}

