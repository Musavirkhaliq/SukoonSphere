// vite.config.js
import { defineConfig } from "file:///C:/Users/Sartaj/Documents/GitHub/SukoonSphere/client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Sartaj/Documents/GitHub/SukoonSphere/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\Sartaj\\Documents\\GitHub\\SukoonSphere\\client";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5100/api",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTYXJ0YWpcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxTdWtvb25TcGhlcmVcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxTYXJ0YWpcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxTdWtvb25TcGhlcmVcXFxcY2xpZW50XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9TYXJ0YWovRG9jdW1lbnRzL0dpdEh1Yi9TdWtvb25TcGhlcmUvY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5cclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuXHJcbiAgc2VydmVyOiB7XHJcblxyXG4gICAgcHJveHk6IHtcclxuXHJcbiAgICAgICcvYXBpJzoge1xyXG5cclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxMDAvYXBpJyxcclxuXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG5cclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG5cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuXHJcbiAgcmVzb2x2ZToge1xyXG5cclxuICAgIGFsaWFzOiB7XHJcblxyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG5cclxuICAgIH0sXHJcblxyXG4gIH0sXHJcblxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLFNBQVMsb0JBQW9CO0FBQ3pYLE9BQU8sV0FBVztBQUVsQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFFMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBRWpCLFFBQVE7QUFBQSxJQUVOLE9BQU87QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUVOLFFBQVE7QUFBQSxRQUVSLGNBQWM7QUFBQSxRQUVkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BRTlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUVQLE9BQU87QUFBQSxNQUVMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUV0QztBQUFBLEVBRUY7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
