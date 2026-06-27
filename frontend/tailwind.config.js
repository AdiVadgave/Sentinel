/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // VZI / Zensar enterprise palette — dark navy + safety red
        navy: {
          50: "#eef1f7",
          700: "#16224a",
          800: "#0f1838",
          900: "#0a1129",
          950: "#060b1c",
        },
        brand: {
          DEFAULT: "#1e3a8a",
          accent: "#2563eb",
        },
        safety: {
          red: "#dc2626",
          amber: "#f59e0b",
          green: "#16a34a",
          slate: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(16,24,56,0.08), 0 1px 2px rgba(16,24,56,0.06)",
        lift: "0 10px 30px rgba(10,17,41,0.15)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
      animation: {
        shimmer: "shimmer 1.4s infinite linear",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
