export type ColorValue = [number, number, number] | [number, number, number, number];

export function cssColorToRGB(color: string): ColorValue | null {
    // 在浏览器创建一个看不见的元素，把随便什么值喂给它（只要是合法的 CSS 颜色表记就行）
    const el = document.createElement("div");
    el.style.color = color;

    // 然后再读取它就变成 rgb 或 rgba 开头的标准值了
    const matchRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/;
    const matchResult = matchRegex.exec(el.style.color);
    if (!matchResult) {
        return null;
    }
    if (matchResult[4]) {
        return [Number(matchResult[1]), Number(matchResult[2]), Number(matchResult[3]), Number(matchResult[4])];
    }
    return [Number(matchResult[1]), Number(matchResult[2]), Number(matchResult[3])];
}

export function checkColorEqual(a: ColorValue, b: ColorValue) {
    const compareA = a.length === 3 ? [...a, 1] : a;
    const compareB = a.length === 3 ? [...b, 1] : b;
    for (let i = 0; i < 4; i++) {
        if (compareA[i] !== compareB[i]) {
            return false;
        }
    }
    return true;
}

export function assembleColor(color: ColorValue) {
    return `rgba(${color.join(", ")})`;
}
