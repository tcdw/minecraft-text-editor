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
import usePresetActionsStore from "@/store/rainbowActions.ts";
import usePresetsStore from "@/store/presets.ts";
import { Check, Download, Lock, PenLine, Trash2, Upload } from "lucide-react";
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
import { toast } from "sonner";
import { exportPresetData } from "@/lib/data.ts";
import RainbowPresetsImportDialog from "@/components/RainbowPresetsImportDialog.tsx";
import { BUILTIN_PRESETS } from "@/constants/colors.ts";
import { useTranslation } from "react-i18next";

export default function RainbowPresetsDialog() {
    const { setPresetDialogOpen, presetDialogOpen, setPresetDemand } = usePresetActionsStore();
    const { presets, editPreset, deletePreset } = usePresetsStore();
    const { t } = useTranslation();

    const [editingName, setEditingName] = useState("");
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
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
                <DialogContent className="sm:max-w-[640px] max-h-screen sm:max-h-[calc(100dvh-2rem)] flex flex-col items-stretch">
                    <DialogHeader className={"flex-none"}>
                        <DialogTitle>{t("presets.management")}</DialogTitle>
                        <DialogDescription>{t("presets.description")}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 flex-auto overflow-y-auto">
                        <div className={"flex items-center gap-2"}>
                            <Button variant={"outline"} onClick={() => setImportOpen(true)}>
                                <Upload className={"size-4"} />
                                {t("presets.import")}
                            </Button>
                            <Button variant={"outline"} onClick={exportPresetData}>
                                <Download className={"size-4"} />
                                {t("presets.export")}
                            </Button>
                        </div>
                        <div className={"overflow-x-auto"}>
                            <Table className={"table-fixed min-w-[500px]"}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={"w-36"}>{t("presets.name")}</TableHead>
                                        <TableHead>{t("presets.gradient")}</TableHead>
                                        <TableHead className="text-center w-[8.5rem]">{t("presets.actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {BUILTIN_PRESETS.map(e => (
                                        <TableRow key={e.id}>
                                            <TableCell className="font-medium break-all align-middle py-0">
                                                <div className={"flex items-center"}>
                                                    <Lock className={"size-4"} />
                                                    {t(e.name)}
                                                </div>
                                            </TableCell>
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
                                                    aria-label={t("presets.use")}
                                                    onClick={() => {
                                                        setPresetDemand(e.colors);
                                                        setPresetDialogOpen(false);
                                                        toast.success(t("presets.applied"), {
                                                            description: t(e.name),
                                                        });
                                                    }}
                                                >
                                                    <Check className={"size-4"} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                                                    aria-label={t("presets.rename")}
                                                    onClick={() => handleEdit(i)}
                                                >
                                                    <PenLine className={"size-4"} />
                                                </Button>
                                                <Button
                                                    variant={"ghost"}
                                                    size={"icon"}
                                                    aria-label={t("presets.delete")}
                                                    onClick={() => handleDelete(i)}
                                                >
                                                    <Trash2 className={"size-4"} />
                                                </Button>
                                                <Button
                                                    variant={"ghost"}
                                                    size={"icon"}
                                                    aria-label={t("presets.use")}
                                                    onClick={() => {
                                                        setPresetDemand(e.colors);
                                                        setPresetDialogOpen(false);
                                                        toast.success(t("presets.applied"), {
                                                            description: e.name,
                                                        });
                                                    }}
                                                >
                                                    <Check className={"size-4"} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <DialogFooter className={"flex-none"}>
                        <Button variant={"outline"} onClick={() => setPresetDialogOpen(false)}>
                            {t("presets.cancel")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <RainbowNameDialog
                open={renameOpen}
                onOpenChange={setRenameOpen}
                onSubmit={handleEditDone}
                title={t("presets.renamePreset")}
                description={t("presets.renameDescription")}
                initialName={editingName}
            />
            <RainbowPresetsImportDialog open={importOpen} onOpenChange={setImportOpen} />
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("presets.deleteConfirm")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("presets.deleteConfirmDescription", { name: editingName })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("presets.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteDone}>{t("presets.confirm")}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
