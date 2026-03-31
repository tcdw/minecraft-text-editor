import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./zh_CN";
import enUS from "./en_US";

const STORAGE_KEY = "mte-language";

function getInitialLanguage(): string {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["zh_CN", "en_US"].includes(stored)) {
        return stored;
    }
    const browserLang = navigator.language;
    if (browserLang.startsWith("zh")) {
        return "zh_CN";
    }
    return "en_US";
}

i18n.use(initReactI18next).init({
    resources: {
        zh_CN: { translation: zhCN },
        en_US: { translation: enUS },
    },
    lng: getInitialLanguage(),
    fallbackLng: "zh_CN",
    interpolation: {
        escapeValue: false,
    },
});

i18n.on("languageChanged", lng => {
    localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
