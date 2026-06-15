import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import tailwindcss from "@tailwindcss/postcss";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [pluginReact(), pluginSass()],
    html: {
        template: "./index.html",
    },
    source: {
        entry: {
            index: "./src/main.tsx",
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    tools: {
        postcss: (_, { addPlugins }) => {
            addPlugins(tailwindcss());
        },
    },
});
