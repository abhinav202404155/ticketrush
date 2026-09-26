/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3ff",
          100: "#dbe6ff",
          400: "#5b82f0",
          500: "#3b63e8",
          600: "#2947c7",
          700: "#1f379e",
          900: "#0f1a45",
        },
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(15, 26, 69, 0.25)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px -12px rgba(59,99,232,0.45)",
      },
    },
  },
  plugins: [],
};
