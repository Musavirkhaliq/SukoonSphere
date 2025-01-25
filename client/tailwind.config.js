/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    keyframes: {
      breathe: {
        "0%, 100%": {
          transform: "scale(0.9) translate(-50%, -50%)",
          opacity: 0.9,
        },
        "50%": { transform: "scale(1.1) translate(-50%, -50%)", opacity: 1 },
      },
      fadeIn: {
        "0%": { opacity: "0", transform: "translateY(-10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      fadeOut: {
        "0%": { opacity: "1", transform: "translateY(0)" },
        "100%": { opacity: "0", transform: "translateY(10px)" },
      },
    },
    animation: {
      fadeIn: "fadeIn 1s ease-in-out",
      fadeOut: "fadeOut 1s ease-in-out",
      "spin-slow": "spin 3s linear infinite",
      "spin-slow-reverse": "spin 4s linear infinite reverse",
      breathe: "breathe 4s ease-in-out infinite",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("daisyui"),
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
