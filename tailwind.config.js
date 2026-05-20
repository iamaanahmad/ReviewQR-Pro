/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Force RGB color format instead of OKLCH for html2canvas compatibility
  corePlugins: {
    // This ensures Tailwind uses RGB instead of OKLCH
  },
}
