import escapeHTML from "escape-html";

export interface MinecraftStringItem {
    text: string;
    color?: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

export function parseFromHTML(html: string) {
    const el = document.getElementById("parser-temp") as HTMLElement;
    el.innerHTML = html;

    const msi: MinecraftStringItem[] = [];
    const elements = el.querySelectorAll("*");
    elements.forEach(e => {
        if (e.childNodes.length === 1 && e.childNodes[0].nodeType === Node.TEXT_NODE) {
            const styles = getComputedStyle(e);
            console.log(styles.textDecorationLine);
            const { color } = styles;
            const bold = Number(styles.fontWeight) >= 700;
            const italic = styles.fontStyle === "italic" || styles.fontStyle === "oblique";
            const underline = styles.textDecorationLine.includes("underline");
            const strikethrough = styles.textDecorationLine.includes("line-through");
            const text = `${e.textContent}`;
            msi.push({
                text: text,
                color: color.startsWith("rgba") ? undefined : color,
                bold,
                italic,
                underline,
                strikethrough,
            });
        }
    });

    return msi;
}

export function stringItemsToHTML(tree: MinecraftStringItem[]) {
    let html = "";
    tree.forEach(e => {
        let char = escapeHTML(e.text);
        if (e.bold) {
            char = `<b>${char}</b>`;
        }
        if (e.italic) {
            char = `<i>${char}</i>`;
        }
        if (e.underline) {
            char = `<u>${char}</u>`;
        }
        if (e.strikethrough) {
            char = `<s>${char}</s>`;
        }
        if (e.color) {
            char = `<span style="color: ${e.color}">${char}</span>`;
        }
        html += char;
    });
    return html;
}
