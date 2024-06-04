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
import { useRef, useState } from "react";
import RainbowNameDialog from "@/components/RainbowNameDialog.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RainbowPresetsDialog() {
    const { setPresetDialogOpen, presetDialogOpen } = usePresetActionsStore(
        useShallow(state => ({
            setPresetDialogOpen: state.setPresetDialogOpen,
            presetDialogOpen: state.presetDialogOpen,
        })),
    );
    const { presets, editPreset, deletePreset } = usePresetsStore(
        useShallow(state => ({
            presets: state.presets,
            editPreset: state.editPreset,
            deletePreset: state.deletePreset,
        })),
    );

    const [editingName, setEditingName] = useState("");
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const currentEditingIndex = useRef(-1);

    function handleEdit(index: number) {
        currentEditingIndex.current = index;
        setEditingName(presets[index].name);
        setRenameOpen(true);
    }

    function handleEditDone(name: string) {
        const index = currentEditingIndex.current;
        const target = presets[index];
        target.name = name;
        editPreset(index, target);
    }

    function handleDelete(index: number) {
        currentEditingIndex.current = index;
        setEditingName(presets[index].name);
        setDeleteOpen(true);
    }

    function handleDeleteDone() {
        deletePreset(currentEditingIndex.current);
    }

    return (
        <>
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
                                {presets.map((e, i) => (
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
                                            <Button
                                                variant={"ghost"}
                                                size={"icon"}
                                                aria-label={"重命名"}
                                                onClick={() => handleEdit(i)}
                                            >
                                                <PenLine className={"size-4"} />
                                            </Button>
                                            <Button
                                                variant={"ghost"}
                                                size={"icon"}
                                                aria-label={"删除"}
                                                onClick={() => handleDelete(i)}
                                            >
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
                        <Button variant={"outline"} onClick={() => setPresetDialogOpen(false)}>
                            取消
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <RainbowNameDialog
                open={renameOpen}
                onOpenChange={setRenameOpen}
                onSubmit={handleEditDone}
                title={"重命名渐变预设"}
                description={"请输入新的渐变预设名称："}
                initialName={editingName}
            />
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>删除确认</AlertDialogTitle>
                        <AlertDialogDescription>{`确定要删除预设「${editingName}」吗？此操作不可逆，请再次确认。`}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteDone}>确定</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
