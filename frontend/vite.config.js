import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            exportAsDefault: false, // Đảm bảo bạn không dùng exportAsDefault
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'cropperjs/dist/cropper.css': path.resolve(
                __dirname,
                'node_modules/cropperjs/dist/cropper.css'
            ),
        },
    },
    // server: {
    //     headers: {
    //         'Cross-Origin-Embedder-Policy': 'require-corp',
    //         'Cross-Origin-Opener-Policy': 'same-origin',
    //     },
    // },
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core', '@ffmpeg/util'],
    },
})
