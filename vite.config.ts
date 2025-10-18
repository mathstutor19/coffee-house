import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 5173,
    open: true, // brauzer avtomatik ochiladi
    proxy: {
      // 👉 barcha "/api" bilan boshlanadigan so‘rovlar backend’ga yo‘naltiriladi
      "/api": {
        target: "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist", // build qilinganda chiqish papkasi
  },
});
