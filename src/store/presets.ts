import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Preset {
    id: string;
    name: string;
    colors: string[];
}

export interface PresetsProps {
    presets: Preset[];
}

export interface PresetsMethods {
    setPresets: (presets: Preset[]) => void;
    addPreset: (preset: Preset) => void;
}

const usePresetsStore = create<PresetsProps & PresetsMethods>()(
    persist(
        (setState, getState) => ({
            presets: [],
            setPresets: presets => setState({ presets }),
            addPreset: preset => {
                const presets = getState().presets.concat();
                presets.push(preset);
                setState({ presets });
            },
        }),
        {
            name: "presets-storage", // name of the item in the storage (must be unique)
            // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
);

export default usePresetsStore;
