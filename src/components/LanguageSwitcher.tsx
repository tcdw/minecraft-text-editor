import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
    { code: "zh_CN", label: "中文 (简体)" },
    { code: "en_US", label: "English" },
] as const;

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                    <Languages className={"size-4"} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {LANGUAGES.map(lang => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        className={i18n.language === lang.code ? "font-bold" : ""}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
