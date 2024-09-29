import type { Config } from "tailwindcss";

export default {
  content: ["{pages,components}/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
