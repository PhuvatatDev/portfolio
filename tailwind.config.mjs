/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'lg': '1180px',
      },
      colors: {
        'pistachio': '#B5C99A',
        'pistachio-pale': '#E8EDDF',
        'pistachio-deep': '#5C7A3A',
        'charcoal': '#1A1A1A',
        'charcoal-deep': '#1C1C1C',
        'warm-gray': '#8A8A7A',
        'cream': '#F5F3EF',
      },
      fontFamily: {
        'serif': ['"DM Serif Display"', 'serif'],
        'mono': ['"Chivo Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
