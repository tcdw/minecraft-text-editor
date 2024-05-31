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

    const msi: MinecraftStringItem[] = [];
    const elements = el.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        if (e.childNodes.length === 1 && e.childNodes[0].nodeType === Node.TEXT_NODE) {
            const styles = getComputedStyle(e);
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
    }

    return msi;
}

/**
 * 从多彩文本数据结构生成 HTML
 * @param tree
 */
export function stringItemsToHTML(tree: MinecraftStringItem[]) {
    let html = "";
    for (let i = 0; i < tree.length; i++) {
        const e = tree[i];
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
    }
    return html;
}

/**
 * 优化多彩文本数据结构
 * @param item 需要优化的数据结构。数据会被就地操作。
 * @returns 优化结果
 */
export function optimizeTree(item: MinecraftStringItem[]) {
    let i = 0;
    while (i < item.length) {
        // 零宽字符的移除
        const char = item[i].text.replace(/[\n\r\u200B-\u200D\uFEFF]/g, "");
        if (!char) {
            item.splice(i, 1);
            continue;
        }
        if (i <= 0) {
            i = 1;
            continue;
        }
        // 相同样式的文字的合并
        if (
            item[i].color === item[i - 1].color &&
            item[i].bold === item[i - 1].bold &&
            item[i].italic === item[i - 1].italic &&
            item[i].strikethrough === item[i - 1].strikethrough &&
            item[i].underline === item[i - 1].underline
        ) {
            item[i - 1].text += item[i].text;
            item.splice(i, 1);
            continue;
        }
        i += 1;
    }
    return item;
}

export function toMinecraftString(item: MinecraftStringItem[]) {
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
