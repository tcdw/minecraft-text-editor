import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsProps {
    editorTheme: string;
}

export interface SettingsMethods {
    setEditorTheme: (editorTheme: string) => void;
}

const useSettingsStore = create<SettingsProps & SettingsMethods>()(
    persist(
        setState => ({
            editorTheme: "chat-dark",
            setEditorTheme: editorTheme => setState({ editorTheme }),
        }),
        {
            name: "settings-storage", // name of the item in the storage (must be unique)
            // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
);

export default useSettingsStore;
