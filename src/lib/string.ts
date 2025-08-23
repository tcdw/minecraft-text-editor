import * as color from "./colors.ts";
import { assembleRGB } from "./colors.ts";
import escapeHTML from "escape-html";

// 全角字符匹配 - 使用 Unicode 属性匹配 CJK 字符和全角符号
const FULL_WIDTH_CHAR_REGEX =
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\u{3000}-\u{303F}\u{FF01}-\u{FF60}]/u;

export interface MeasuredCharacter {
    char: string;
    width: number;
}

export interface MeasuredString {
    chars: MeasuredCharacter[];
    width: number;
}

/**
 * 测量字符串的长度
 * @param input
 */
export function measureLength(input: string): MeasuredString {
    let width = 0;
    const chars = Array.from(input).map(char => {
        const charWidth = FULL_WIDTH_CHAR_REGEX.test(char) ? 2 : 1;
        width += charWidth;
        return {
            char,
            width: charWidth,
        } as MeasuredCharacter;
    });
    return {
        chars,
        width,
    };
}

export interface CreateGradientColorParams {
    colors: string[];
    text: string;
}

export interface MeasuredStringColor extends MeasuredCharacter {
    color: string;
}

export function createGradientColor({ colors, text }: CreateGradientColorParams) {
    if (colors.length < 2) {
        throw new Error("At least two color values required");
    }

    // 将颜色拆分成多个小组
    const parts: [string, string][] = [];
    for (let i = 0; i < colors.length - 1; i++) {
        parts.push([colors[i], colors[i + 1]]);
    }

    // 拆分字符串，测距
    const measured = measureLength(text);

    // 计算非空白字符的位置用于渐变计算
    const nonWhitespaceChars = measured.chars.filter(({ char }) => !/^\s$/.test(char));
    const nonWhitespaceWidth = nonWhitespaceChars.reduce((sum, { width }) => sum + width, 0);

    // 分段，一段的长度为 1（也就是说三段的长度为 3）
    let position = 0;
    let lastColor = "";

    const colored: MeasuredStringColor[] = measured.chars.map(({ char, width }) => {
        let currentColor: string;

        if (/^\s$/.test(char)) {
            // 空白字符使用上一个字符的颜色
            currentColor = lastColor || assembleRGB(color.mix(parts[0][1], parts[0][0], 0));
        } else {
            // 非空白字符正常计算颜色
            const belongPositionFull = (position / (nonWhitespaceWidth || 1)) * parts.length;
            const belongSegment = Math.min(Math.floor(belongPositionFull), parts.length - 1);
            const belongPositionSegment = belongPositionFull - belongSegment;

            currentColor = assembleRGB(
                color.mix(parts[belongSegment][1], parts[belongSegment][0], belongPositionSegment),
            );
            position += width;
            lastColor = currentColor;
        }

        return {
            char,
            width,
            color: currentColor,
        };
    });

    return colored;
}

export function measuredStringColorToHTML(from: MeasuredStringColor[]) {
    return from.map(e => `<span style="color: ${e.color}">${escapeHTML(e.char)}</span>`).join("");
}
