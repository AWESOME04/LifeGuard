const { colors } = require("@mui/material");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#407CE2',
        'custom-blue-hover': '#2d5bb9',
        'loading': '#6c94e0'
      }
    },
  },
  plugins: [],
}

