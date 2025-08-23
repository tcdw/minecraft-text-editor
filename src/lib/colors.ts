import Color from "colorjs.io";

export function mix(to: string, from: string, amount: number) {
    try {
        const fromColor = new Color(from);
        const toColor = new Color(to);
        const mixed = fromColor.mix(toColor, amount);
        const [r, g, b] = mixed.to("srgb").coords.map(coord => Math.round(coord * 255));
        const alpha = mixed.alpha ?? 1;
        return [r, g, b, alpha];
    } catch {
        throw new Error("Both color must be valid CSS color");
    }
}

export function assembleRGBA(color: Array<string | number>) {
    return `rgba(${color.join(", ")})`;
}

export function assembleRGB(color: Array<string | number>) {
    return `rgb(${color.slice(0, 3).join(", ")})`;
}

export function randomHexColor() {
    const color = new Color({
        space: "srgb",
        coords: [Math.random(), Math.random(), Math.random()],
    });
    return color.toString({ format: "hex" });
}
