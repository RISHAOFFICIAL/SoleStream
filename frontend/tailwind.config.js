/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A8E6CF",
        secondary: "#E5D3B3",
        accent: "#FFFDD0",
        neutral: "#333333",
        background: "#F9FBF9",
      },
      borderRadius: {
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
