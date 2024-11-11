import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          DEFAULT: '#444444',
          primary: '#EBF6FF',
          dark: '#70808F',
          light: '#F9F9F9'
        },
        blue: {
          DEFAULT: '#165585',
          primary: '#2285D0',
          dark: '#165585',
          light:'#EBF6FF'
        },
        green: {
          primary: '#4CAF50',
          dark: '#317033',
          light: '#F1FFF2'
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

