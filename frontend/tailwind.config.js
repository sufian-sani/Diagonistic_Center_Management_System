/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(180px, 1fr))'
      },
      colors:{
        'primary':'#334155', // Slate 700 - Subtler than Slate 900
        'primary-light': '#f1f5f9',
        'accent': '#6366f1' // Indigo 500 for subtle highlights
      }
    },
  },
  plugins: [],
}