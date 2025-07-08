// vite.config.js
import react from "file:///D:/Workspace/Web/Instagram_clone/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { defineConfig } from "file:///D:/Workspace/Web/Instagram_clone/frontend/node_modules/vite/dist/node/index.js";
import svgr from "file:///D:/Workspace/Web/Instagram_clone/frontend/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "D:\\Workspace\\Web\\Instagram_clone\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: false
      // Đảm bảo bạn không dùng exportAsDefault
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "cropperjs/dist/cropper.css": path.resolve(
        __vite_injected_original_dirname,
        "node_modules/cropperjs/dist/cropper.css"
      )
    }
  },
  // server: {
  //     headers: {
  //         'Cross-Origin-Embedder-Policy': 'require-corp',
  //         'Cross-Origin-Opener-Policy': 'same-origin',
  //     },
  // },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/core", "@ffmpeg/util"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3Jrc3BhY2VcXFxcV2ViXFxcXEluc3RhZ3JhbV9jbG9uZVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcV29ya3NwYWNlXFxcXFdlYlxcXFxJbnN0YWdyYW1fY2xvbmVcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1dvcmtzcGFjZS9XZWIvSW5zdGFncmFtX2Nsb25lL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICByZWFjdCgpLFxuICAgICAgICBzdmdyKHtcbiAgICAgICAgICAgIGV4cG9ydEFzRGVmYXVsdDogZmFsc2UsIC8vIFx1MDExMFx1MUVBM20gYlx1MUVBM28gYlx1MUVBMW4ga2hcdTAwRjRuZyBkXHUwMEY5bmcgZXhwb3J0QXNEZWZhdWx0XG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICAgICAgICdjcm9wcGVyanMvZGlzdC9jcm9wcGVyLmNzcyc6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgICAgICAgJ25vZGVfbW9kdWxlcy9jcm9wcGVyanMvZGlzdC9jcm9wcGVyLmNzcydcbiAgICAgICAgICAgICksXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBzZXJ2ZXI6IHtcbiAgICAvLyAgICAgaGVhZGVyczoge1xuICAgIC8vICAgICAgICAgJ0Nyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3knOiAncmVxdWlyZS1jb3JwJyxcbiAgICAvLyAgICAgICAgICdDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeSc6ICdzYW1lLW9yaWdpbicsXG4gICAgLy8gICAgIH0sXG4gICAgLy8gfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgZXhjbHVkZTogWydAZmZtcGVnL2ZmbXBlZycsICdAZmZtcGVnL2NvcmUnLCAnQGZmbXBlZy91dGlsJ10sXG4gICAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVULE9BQU8sV0FBVztBQUN6VSxPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNELGlCQUFpQjtBQUFBO0FBQUEsSUFDckIsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyw4QkFBOEIsS0FBSztBQUFBLFFBQy9CO0FBQUEsUUFDQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBT0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLGtCQUFrQixnQkFBZ0IsY0FBYztBQUFBLEVBQzlEO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
