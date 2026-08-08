import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    historyApiFallback: true,
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/tests/setup.js"],
    include: ["src/tests/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
});
