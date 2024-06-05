import usePresetsStore, { Preset } from "@/store/presets.ts";
import { parse, stringify } from "smol-toml";
import { saveString } from "@/lib/saveFile.ts";
import { v4 } from "uuid";

const KIND_IDENTIFIER = "run.tuu.mte.gradient";

export async function importPresetData(data: File) {
    const raw = await data.arrayBuffer();
    const decoded = new TextDecoder().decode(raw);
    const parsed: any = parse(decoded);
    if (parsed?.kind !== KIND_IDENTIFIER || parsed?.version !== 1) {
        throw new Error("不支持的数据格式");
    }
    const newPresets: Preset[] = parsed?.presets ?? [];
    newPresets.forEach(e => {
        e.id = v4();
    });
    const { presets } = usePresetsStore.getState();
    usePresetsStore.getState().setPresets(presets.concat(newPresets));
    return presets;
}

export function exportPresetData() {
    const { presets } = usePresetsStore.getState();
    const exportObject = structuredClone({
        kind: KIND_IDENTIFIER,
        version: 1,
        presets,
    });
    exportObject.presets.forEach(e => {
        e.id = undefined;
    });
    const toml = stringify(exportObject);
    saveString(`渐变色预设导出_${new Date().getTime()}.toml`, toml);
}
