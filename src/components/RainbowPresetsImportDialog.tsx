import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { importPresetData } from "@/lib/data.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const FormSchema = z.object({
    file: z.instanceof(File, { message: i18n.t("presets.selectFile") }),
});

export interface RainbowPresetsImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RainbowPresetsImportDialog({ open, onOpenChange }: RainbowPresetsImportDialogProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            file: undefined,
        },
    });
    const { t } = useTranslation();

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        try {
            const records = (await importPresetData(formData.file)).length;
            toast.success(t("presets.importSuccess"), {
                description: t("presets.importCount", { count: records }),
            });
            onOpenChange(false);
        } catch (e) {
            toast.error(t("presets.importFailed"), {
                description: `${(e as Error).message}`,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("presets.importPreset")}</DialogTitle>
                    <DialogDescription>{t("presets.importDescription")}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="file"
                                // https://github.com/shadcn-ui/ui/discussions/2137
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>{t("presets.presetFile")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...fieldProps}
                                                onChange={event => {
                                                    onChange(event.target.files && event.target.files[0]);
                                                }}
                                                type="file"
                                                accept={".toml"}
                                                multiple={false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type={"button"} variant={"outline"} onClick={() => onOpenChange(false)}>
                                {t("presets.cancel")}
                            </Button>
                            <Button type="submit">{t("presets.import")}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
