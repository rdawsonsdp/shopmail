/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brown-sugar': {
          orange: '#e8924a',
          'orange-light': '#f5b87a',
          'orange-dark': '#d67a2a',
          brown: '#60301e',
          'brown-light': '#8b4d3a',
          'brown-dark': '#4a2416',
        },
      },
      fontFamily: {
        script: ['"Brush Script MT"', '"Lucida Handwriting"', 'cursive'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


