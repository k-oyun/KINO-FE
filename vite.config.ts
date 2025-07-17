import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접속 가능하게 설정
    port: 5173, // 사용할 포트 (기본값은 3000)
  },
});
