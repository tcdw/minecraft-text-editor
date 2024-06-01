export const BUILTIN_COLOR: ReadonlyArray<string> = [
    "#000000",
    "#0000aa",
    "#00aa00",
    "#00aaaa",
    "#aa0000",
    "#aa00aa",
    "#ffaa00",
    "#aaaaaa",
    "#555555",
    "#5555ff",
    "#55ff55",
    "#55ffff",
    "#ff5555",
    "#ff55ff",
    "#ffff55",
    "#ffffff",
];

export interface EditorColor {
    background: string;
    foreground: string;
    label: string;
    value: string;
    isLabelOnly?: boolean;
}

export const EDITOR_COLOR: ReadonlyArray<EditorColor> = [
    { background: "#222222", foreground: "#ffffff", label: "聊天栏（深色）", value: "chat-dark" },
    { background: "#888888", foreground: "#ffffff", label: "聊天栏（浅色）", value: "chat-light" },
    { background: "#ffffff", foreground: "#000000", label: "书", value: "book" },
    { background: "", foreground: "", label: "告示牌", value: "wood", isLabelOnly: true },
    { background: "#ae8d5a", foreground: "#000000", label: "橡木", value: "wood-1" },
    { background: "#7b5e3c", foreground: "#000000", label: "云杉木", value: "wood-2" },
    { background: "#d6ca94", foreground: "#000000", label: "白桦木", value: "wood-3" },
    { background: "#b28869", foreground: "#000000", label: "丛林木", value: "wood-4" },
    { background: "#b06641", foreground: "#000000", label: "金合欢木", value: "wood-5" },
    { background: "#45301b", foreground: "#000000", label: "深色橡木", value: "wood-6" },
    { background: "#743d54", foreground: "#000000", label: "绯红木", value: "wood-7" },
    { background: "#4b7f7f", foreground: "#000000", label: "诡异木", value: "wood-8" },
    { background: "#6e292c", foreground: "#000000", label: "红树木", value: "wood-9" },
    { background: "#d69297", foreground: "#000000", label: "樱花木", value: "wood-10" },
    { background: "#c6af4c", foreground: "#000000", label: "竹", value: "wood-11" },
];
