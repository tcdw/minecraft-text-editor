import "./styles.css";
import "./editor.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { createGradientColor } from "@/lib/string.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
        <Toaster />
    </React.StrictMode>,
);

createGradientColor({
    colors: ["#66ccff", "#00ff00", "#ff9800"],
    text: "测试文本测试文本1234567890",
});
createGradientColor({
    colors: ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ff0000"],
    text: "测试文本测试文本1234567890测试文本",
});
