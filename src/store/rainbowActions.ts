import { create } from "zustand";

export interface RainbowActionsProps {
    presetDemand: string[] | null;
    presetDialogOpen: boolean;
}

export interface RainbowActionsMethods {
    setPresetDemand: (presetDemand: string[] | null) => void;
    setPresetDialogOpen: (presetDialogOpen: boolean) => void;
}

const useRainbowActionsStore = create<RainbowActionsProps & RainbowActionsMethods>()(setState => ({
    presetDemand: null,
    setPresetDemand: presetDemand => setState({ presetDemand }),
    presetDialogOpen: false,
    setPresetDialogOpen: presetDialogOpen => setState({ presetDialogOpen }),
}));

export default useRainbowActionsStore;
