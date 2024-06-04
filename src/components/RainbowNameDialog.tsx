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
    initialName = "未命名预设",
}: RainbowNameDialogProps) {
    const id = useId();
    const [name, setName] = useState("未命名预设");

    useEffect(() => {
        if (open) {
            setName(initialName);
        }
    }, [open, initialName]);

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
                            预设名称
                        </label>
                        <Input id={id} value={name} onChange={e => setName(e.currentTarget.value)} />
                    </div>
                    <DialogFooter>
                        <Button type="submit">保存</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
