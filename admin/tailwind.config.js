/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        'primary':'#334155', 
        'primary-light':'#f1f5f9',
        'secondary':'#6366f1', 
        'accent': '#94a3b8', 
        'warning': '#f59e0b', 
        'error': '#ef4444', 
      }
    },
  },
  plugins: [],
}