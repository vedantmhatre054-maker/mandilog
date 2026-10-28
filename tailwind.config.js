/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          bg: '#F7F8F2',
          card: '#E8EFE4',
          white: '#FFFFFF',
          primary: '#246B45',
          leaf: '#76A94C',
          accent: '#E8CFA3',
          text: '#26352B',
          border: '#DFE5DA',
        },
      },
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Google Sans Flex"', '"Google Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
