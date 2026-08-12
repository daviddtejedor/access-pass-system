import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "@/app/**/*.{js,ts,jsx,tsx,mdx}",
    "@/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "@/app/(Pages)/**/*.{js,ts,jsx,tsx,mdx}",
    "@/app/context/**/*.{js,ts,jsx,tsx,mdx}",
    "@/app/services/**/*.{js,ts,jsx,tsx,mdx}",
    "@/app/types/**/*.{js,ts,jsx,tsx,mdx}",
    "@/app/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
