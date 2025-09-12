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
  "rules": {
    "at-rule-no-unknown": [true, {
      "ignoreAtRules": ["tailwind", "apply", "layer", "variants", "responsive", "screen"]
    }]
  }
} satisfies Config;


// .stylelintrc

   
  