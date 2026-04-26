/** @type {import("tailwindcss").Config} */
const config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        "bg-sunk": "var(--bg-sunk)",
        fg: "var(--fg)",
        "fg-mute": "var(--fg-mute)",
        "fg-faint": "var(--fg-faint)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        hairline: "var(--hairline)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-ring": "var(--accent-ring)",
        "accent-contrast": "var(--accent-contrast)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.4, 0, 0.2, 1)",
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      screens: {
        sm: "500px",
        md: "860px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
