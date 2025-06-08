import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import NutUIResolver from "@nutui/auto-import-resolver";
import vitePluginStyleVwLoader from "vite-plugin-style-vw-loader";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vitePluginStyleVwLoader(),
        vue(),

        Components({
            resolvers: [NutUIResolver()],
        }),
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000/",
                changeOrigin: true,
            },
        },
    }
});
