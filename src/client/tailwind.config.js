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
			'green': '#009e5c',
			'pink': '#ff005c',
		},
	},
  },
  plugins: [],
}

