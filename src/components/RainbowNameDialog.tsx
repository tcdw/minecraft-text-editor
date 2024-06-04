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
import { ReactNode, useId } from "react";

export interface RainbowNameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string) => void;
    title: ReactNode;
    description: ReactNode;
}

export default function RainbowNameDialog({
    open,
    onOpenChange,
    onSubmit,
    title,
    description,
}: RainbowNameDialogProps) {
    const id = useId();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[512px]">
                <form
                    onSubmit={e => {
                        const el = document.getElementById(id) as HTMLInputElement;
                        onSubmit(el.value);
                        el.value = "";
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
                        <Input id={id} defaultValue="未命名预设" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">保存</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
