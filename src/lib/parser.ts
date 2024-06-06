import escapeHTML from "escape-html";
import { BUILTIN_COLOR } from "@/constants/colors.ts";
import Color from "colorjs.io";
import { MinecraftTextFragment } from "@/types/main";

/**
 * 从 HTML 解析多彩文本数据结构
 * @param html
 */
export function parseFromHTML(html: string) {
    const el = document.getElementById("parser-temp") as HTMLElement;
    el.innerHTML = html;

    const msi: MinecraftTextFragment[][] = [];
    let paragraph: ArrayLike<HTMLElement> = el.querySelectorAll("p");
    if (paragraph.length <= 0) {
        paragraph = [el];
    }
    for (let i = 0; i < paragraph.length; i++) {
        const msiPara: MinecraftTextFragment[] = [];
        const f = paragraph[i];
        const elements = f.querySelectorAll("*");
        for (let j = 0; j < elements.length; j++) {
            const e = elements[j];
            if (e.childNodes.length === 1 && e.childNodes[0].nodeType === Node.TEXT_NODE) {
                const styles = getComputedStyle(e);
                const color = new Color(styles.color).toString({ format: "hex" });
                const bold = Number(styles.fontWeight) >= 700;
                const italic = styles.fontStyle === "italic" || styles.fontStyle === "oblique";
                const underline = styles.textDecorationLine.includes("underline");
                const strikethrough = styles.textDecorationLine.includes("line-through");
                const text = `${e.textContent}`;
                msiPara.push({
                    text: text,
                    // Need filtered: `#RGBA` or `#RRGGBBAA`
                    color: color?.length === 5 || color?.length === 9 ? undefined : color,
                    bold,
                    italic,
                    underlined: underline,
                    strikethrough,
                });
            }
        }
        msi.push(msiPara);
    }

    return msi;
}

/**
 * 从多彩文本数据结构生成 HTML
 * @param tree
 */
export function stringItemsToHTML(tree: MinecraftTextFragment[][]) {
    let html = "";
    for (let i = 0; i < tree.length; i++) {
        html += "<p>";
        const e = tree[i];
        for (let j = 0; j < e.length; j++) {
            const f = e[j];
            let char = escapeHTML(f.text);
            if (f.bold) {
                char = `<b>${char}</b>`;
            }
            if (f.italic) {
                char = `<i>${char}</i>`;
            }
            if (f.underlined) {
                char = `<u>${char}</u>`;
            }
            if (f.strikethrough) {
                char = `<s>${char}</s>`;
            }
            if (f.color) {
                char = `<span style="color: ${f.color}">${char}</span>`;
            }
            html += char;
        }
        html += "</p>";
    }
    return html;
}

export function toMinecraftStringLine(item: MinecraftTextFragment[]) {
    let result = "";
    for (let i = 0; i < item.length; i++) {
        const e = item[i];
        if (
            i <= 0 ||
            e.color !== item[i - 1].color ||
            (!e.bold && item[i - 1].bold) ||
            (!e.strikethrough && item[i - 1].strikethrough) ||
            (!e.underlined && item[i - 1].underlined) ||
            (!e.italic && item[i - 1].italic)
        ) {
            if (!e.color) {
                result += "&r";
            } else {
                // const hexColor = rgb2hex(e.color).hex;
                const hexColor = new Color(e.color).to("srgb").toString({ format: "hex" });
                for (let j = 0; j < BUILTIN_COLOR.length; j += 1) {
                    if (hexColor === `${BUILTIN_COLOR[j]}`) {
                        result += `&${j.toString(16)}`;
                        break;
                    }
                    if (j >= BUILTIN_COLOR.length - 1) {
                        result += `&${hexColor}`;
                    }
                }
            }
        }
        if (e.bold) {
            result += "&l";
        }
        if (e.strikethrough) {
            result += "&m";
        }
        if (e.underlined) {
            result += "&n";
        }
        if (e.italic) {
            result += "&o";
        }
        let content = e.text;
        content = content.replace(/&#[0-9a-fA-F]{6}/g, match => `&${match}`);
        content = content.replace(/&[0-9a-f]/g, match => `&${match}`);
        content = content.replace(/&l/g, "&&l");
        content = content.replace(/&m/g, "&&m");
        content = content.replace(/&n/g, "&&n");
        content = content.replace(/&o/g, "&&o");
        content = content.replace(/&k/g, "&&k");
        content = content.replace(/&r/g, "&&r");
        result += content;
    }
    return result;
}

export function toMinecraftString(item: MinecraftTextFragment[][]) {
    const text = item.map(e => toMinecraftStringLine(e));
    return text.join("\n");
}

export function fromMinecraftStringLine(str: string) {
    const state = {
        color: undefined as undefined | string,
        bold: false,
        italic: false,
        underlined: false,
        strikethrough: false,
    };
    const out: MinecraftTextFragment[] = [];

    let i = 0;
    while (i <= str.length - 1) {
        switch (str[i]) {
            case "&": {
                // escape char
                if (str[i + 1] === "&") {
                    i += 2;
                    out.push({ ...state, text: "&" });
                    break;
                }
                if (str[i + 1] === "l") {
                    state.bold = true;
                    i += 2;
                    break;
                }
                if (str[i + 1] === "m") {
                    state.strikethrough = true;
                    i += 2;
                    break;
                }
                if (str[i + 1] === "n") {
                    state.underlined = true;
                    i += 2;
                    break;
                }
                if (str[i + 1] === "o") {
                    state.italic = true;
                    i += 2;
                    break;
                }
                if (str[i + 1] === "r") {
                    state.bold = false;
                    state.strikethrough = false;
                    state.underlined = false;
                    state.italic = false;
                    state.color = undefined;
                    i += 2;
                    break;
                }
                // rgb color
                if (str[i + 1] === "#" && /^[0-9a-fA-F]{6}$/.test(str.slice(i + 2, i + 8))) {
                    state.bold = false;
                    state.strikethrough = false;
                    state.underlined = false;
                    state.italic = false;
                    state.color = `#${str.slice(i + 2, i + 8)}`;
                    i += 8;
                    break;
                }
                // builtin color
                if (/^[0-9a-fA-F]$/.test(str[i + 1])) {
                    state.bold = false;
                    state.strikethrough = false;
                    state.underlined = false;
                    state.italic = false;
                    state.color = `${BUILTIN_COLOR[parseInt(str[i + 1], 16)]}`;
                    i += 2;
                    break;
                }
                // other character (remove that!)
                i += 2;
                break;
            }
            default: {
                out.push({ ...state, text: str[i] });
                i += 1;
            }
        }
    }

    return out;
}

export function fromMinecraftString(str: string) {
    const lines = str.split("\n");
    const out: MinecraftTextFragment[][] = [];

    for (let i = 0; i < lines.length; i++) {
        const e = lines[i];
        out.push(fromMinecraftStringLine(e));
    }

    return out;
}
