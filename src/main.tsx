import "./styles.css";
import "./editor.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
        <Toaster />
    </React.StrictMode>,
);
