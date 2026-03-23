/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',    // Slate 900 — fond principal
        accent: '#3B82F6',     // Blue 500 — liens, CTA
        surface: '#1E293B',    // Slate 800 — cartes, sections
        muted: '#94A3B8',      // Slate 400 — texte secondaire
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
