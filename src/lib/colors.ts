export type ColorValue = [number, number, number, number];

export function cssToRGB(color: string): ColorValue | null {
    // 在浏览器创建一个看不见的元素，把随便什么值喂给它（只要是合法的 CSS 颜色表记就行）
    const el = document.createElement("div");
    el.style.color = color;

    // 然后再读取它就变成 rgb 或 rgba 开头的标准值了
    const matchRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/;
    const matchResult = matchRegex.exec(el.style.color);
    if (!matchResult) {
        return null;
    }
    return [
        Number(matchResult[1]),
        Number(matchResult[2]),
        Number(matchResult[3]),
        matchResult[4] ? Number(matchResult[4]) : 1,
    ];
}

export function checkEqual(a: ColorValue, b: ColorValue) {
    for (let i = 0; i < 4; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function mix(to: string, from: string, amount: number) {
    const fromColor = cssToRGB(from);
    const toColor = cssToRGB(to);
    if (!fromColor || !toColor) {
        throw new Error("Both color must be valid CSS color");
    }
    const calcR = fromColor[0] + (toColor[0] - fromColor[0]) * amount;
    const calcG = fromColor[1] + (toColor[1] - fromColor[1]) * amount;
    const calcB = fromColor[2] + (toColor[2] - fromColor[2]) * amount;
    const calcA = fromColor[3] + (toColor[3] - fromColor[3]) * amount;
    return [calcR, calcG, calcB, calcA];
}

export function assembleRGBA(color: Array<string | number>) {
    return `rgba(${color.join(", ")})`;
}

export function assembleRGB(color: Array<string | number>) {
    return `rgb(${color.slice(0, 3).join(", ")})`;
}
