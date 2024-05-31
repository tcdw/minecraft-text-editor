import escapeHTML from "escape-html";
import rgb2hex from "rgb2hex";
import { BUILTIN_COLOR } from "@/constants/colors.ts";

export interface MinecraftStringItem {
    text: string;
    color?: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

/**
 * 从 HTML 解析多彩文本数据结构
 * @param html
 */
export function parseFromHTML(html: string) {
    const el = document.getElementById("parser-temp") as HTMLElement;
    el.innerHTML = html;

    const msi: MinecraftStringItem[][] = [];
    let paragraph: ArrayLike<HTMLElement> = el.querySelectorAll("p");
    if (paragraph.length <= 0) {
        paragraph = [el];
    }
    for (let i = 0; i < paragraph.length; i++) {
        const msiPara: MinecraftStringItem[] = [];
        const f = paragraph[i];
        const elements = f.querySelectorAll("*");
        for (let j = 0; j < elements.length; j++) {
            const e = elements[j];
            if (e.childNodes.length === 1 && e.childNodes[0].nodeType === Node.TEXT_NODE) {
                const styles = getComputedStyle(e);
                const { color } = styles;
                const bold = Number(styles.fontWeight) >= 700;
                const italic = styles.fontStyle === "italic" || styles.fontStyle === "oblique";
                const underline = styles.textDecorationLine.includes("underline");
                const strikethrough = styles.textDecorationLine.includes("line-through");
                const text = `${e.textContent}`;
                msiPara.push({
                    text: text,
                    color: color.startsWith("rgba") ? undefined : color,
                    bold,
                    italic,
                    underline,
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
export function stringItemsToHTML(tree: MinecraftStringItem[][]) {
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
            if (f.underline) {
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

export function toMinecraftStringLine(item: MinecraftStringItem[]) {
    let result = "";
    for (let i = 0; i < item.length; i++) {
        const e = item[i];
        if (
            i <= 0 ||
            e.color !== item[i - 1].color ||
            (!e.bold && item[i - 1].bold) ||
            (!e.strikethrough && item[i - 1].strikethrough) ||
            (!e.underline && item[i - 1].underline) ||
            (!e.italic && item[i - 1].italic)
        ) {
            if (!e.color) {
                result += "&r";
            } else {
                const hexColor = rgb2hex(e.color).hex;
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
        if (e.underline) {
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

export function toMinecraftString(item: MinecraftStringItem[][]) {
    const text = item.map(e => toMinecraftStringLine(e));
    return text.join("\n");
}
