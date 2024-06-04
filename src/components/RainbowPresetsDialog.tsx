import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import usePresetActionsStore from "@/store/presetActions.ts";
import { useShallow } from "zustand/react/shallow";
import usePresetsStore from "@/store/presets.ts";
import { Check, PenLine, Trash2 } from "lucide-react";

export default function RainbowPresetsDialog() {
    const { setPresetDialogOpen, presetDialogOpen } = usePresetActionsStore(
        useShallow(state => ({
            setPresetDialogOpen: state.setPresetDialogOpen,
            presetDialogOpen: state.presetDialogOpen,
        })),
    );
    const { presets } = usePresetsStore(useShallow(state => ({ presets: state.presets })));

    return (
        <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>预设管理</DialogTitle>
                    <DialogDescription>可以应用、重命名和删除你设置的渐变预设。</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Table className={"table-fixed"}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className={"w-36"}>名称</TableHead>
                                <TableHead>渐变</TableHead>
                                <TableHead className="text-center w-[8.5rem]">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {presets.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell className="font-medium break-all">{e.name}</TableCell>
                                    <TableCell className={"py-2"}>
                                        <div
                                            className={"w-full h-6 rounded-full bg-red-500"}
                                            style={{
                                                background: `linear-gradient(90deg, ${e.colors.join(",")})`,
                                            }}
                                        ></div>
                                    </TableCell>
                                    <TableCell className="py-2 px-0 text-center">
                                        <Button variant={"ghost"} size={"icon"} aria-label={"重命名"}>
                                            <PenLine className={"size-4"} />
                                        </Button>
                                        <Button variant={"ghost"} size={"icon"} aria-label={"删除"}>
                                            <Trash2 className={"size-4"} />
                                        </Button>
                                        <Button variant={"ghost"} size={"icon"} aria-label={"使用"}>
                                            <Check className={"size-4"} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant={"outline"}>取消</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
