import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ReactNode, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";

export interface RainbowNameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string) => void;
    title: ReactNode;
    description: ReactNode;
    initialName?: string;
}

export default function RainbowNameDialog({
    open,
    onOpenChange,
    onSubmit,
    title,
    description,
    initialName,
}: RainbowNameDialogProps) {
    const id = useId();
    const { t } = useTranslation();
    const defaultName = initialName ?? t("rainbow.defaultPresetName");
    const [name, setName] = useState(defaultName);

    useEffect(() => {
        if (open) {
            setName(initialName ?? t("rainbow.defaultPresetName"));
        }
    }, [open, initialName, t]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[512px]">
                <form
                    onSubmit={e => {
                        onSubmit(name);
                        onOpenChange(false);
                        e.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <div className={"my-4"}>
                        <label className={"sr-only"} htmlFor={id}>
                            {t("rainbow.presetName")}
                        </label>
                        <Input id={id} value={name} onChange={e => setName(e.currentTarget.value)} />
                    </div>
                    <DialogFooter>
                        <Button type="submit">{t("rainbow.save")}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
