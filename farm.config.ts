import { defineConfig } from "@farmfe/core";
import farmPluginPostcss from "@farmfe/js-plugin-postcss";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

export default defineConfig({
    compilation: {
        partialBundling: {},
        resolve: {
            alias: {
                "@/": path.join(fileURLToPath(import.meta.url), "../src"),
            },
        },
        sourcemap: false,
    },
    server: {
        port: 5173,
    },
    plugins: ["@farmfe/plugin-react", "@farmfe/plugin-sass", farmPluginPostcss()],
    vitePlugins: [],
});
