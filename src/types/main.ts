export interface MinecraftTextFragment {
    text: string;
    color?: string;
    font?: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
    extra?: string;
    // Not implemented yet: `insertion`, `clickEvent`, `hoverEvent`
}

export type MinecraftText = Array<MinecraftTextFragment | string>;
