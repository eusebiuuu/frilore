/** @type {import('tailwindcss').Config} */

function getColor(variable) {
  return () => {
    return `rgb(var(${variable}))`;
  }
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  darkMode: `class`,
  theme: {
    extend: {
      textColor: {
        primary: "var(--clr-primary)",
        secondary: "var(--clr-secondary)",
        tertiary: "var(--clr-tertiary)",
        main: "var(--clr-main)",
        headline: "var(--clr-headline)",
        stroke: "var(--clr-stroke)",
      },
      backgroundColor: {
        primary: "var(--clr-primary)",
        secondary: "var(--clr-secondary)",
        tertiary: "var(--clr-tertiary)",
        main: "var(--clr-main)",
        headline: "var(--clr-headline)",
        stroke: "var(--clr-stroke)",
      }
    }
  },
  plugins: [],
}

