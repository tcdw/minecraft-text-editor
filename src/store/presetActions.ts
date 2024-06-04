import { create } from "zustand";

export interface PresetActionsProps {
    presetDemand: string[] | null;
    presetDialogOpen: boolean;
}

export interface PresetActionsMethods {
    setPresetDemand: (presetDemand: string[] | null) => void;
    setPresetDialogOpen: (presetDialogOpen: boolean) => void;
}

const usePresetActionsStore = create<PresetActionsProps & PresetActionsMethods>()(setState => ({
    presetDemand: null,
    setPresetDemand: presetDemand => setState({ presetDemand }),
    presetDialogOpen: false,
    setPresetDialogOpen: presetDialogOpen => setState({ presetDialogOpen }),
}));

export default usePresetActionsStore;
