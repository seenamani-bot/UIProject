import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./src/**/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        redline: {
          DEFAULT: "#DA291C"
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
