import * as color from "./colors.ts";
import { assembleRGB } from "./colors.ts";

// 全角字符匹配
const FULL_WIDTH_CHAR_REGEX = /^\p{Ideo}|[\uFF01-\uFF61]$/u;

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
 *
 * ```javascript
 * // measureLength("a〆文﨑禰󠄀354３５４")
 * {
 *   chars: [
 *     { char: 'a', width: 1 },
 *     { char: '〆', width: 2 },
 *     { char: '文', width: 2 },
 *     { char: '﨑', width: 2 },
 *     { char: '禰', width: 2 },
 *     { char: '󠄀', width: 1 },
 *     { char: '3', width: 1 },
 *     { char: '5', width: 1 },
 *     { char: '4', width: 1 },
 *     { char: '３', width: 2 },
 *     { char: '５', width: 2 },
 *     { char: '４', width: 2 }
 *   ],
 *   width: 19
 * }
 * ```
 *
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
    console.log(parts);

    // 拆分字符串，测距
    const measured = measureLength(text);
    console.log(measured);

    // 分段，一段的长度为 1（也就是说三段的长度为 3）
    let position = 0;
    const colored: MeasuredStringColor[] = measured.chars.map(({ char, width }) => {
        const belongPositionFull = (position / measured.width) * parts.length;
        const belongSegment = Math.floor(belongPositionFull);
        const belongPositionSegment = belongPositionFull - belongSegment;

        // 最后再移动 position
        position += width;

        return {
            char,
            width,
            color: assembleRGB(color.mix(parts[belongSegment][1], parts[belongSegment][0], belongPositionSegment)),
        };
    });

    const html = colored.map(e => `<span style="color: ${e.color}">${e.char}</span>`);
    document.body.insertAdjacentHTML("beforeend", `<div class="p-4 bg-black">${html.join("")}</div>`);
}
