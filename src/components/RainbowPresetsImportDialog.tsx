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
import { toast } from "@/components/ui/use-toast.ts";

const FormSchema = z.object({
    file: z.instanceof(File, { message: "请选择文件" }),
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

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        try {
            const records = (await importPresetData(formData.file)).length;
            toast({
                title: "导入成功",
                description: `共计导入 ${records} 条数据`,
            });
            onOpenChange(false);
        } catch (e) {
            toast({
                title: "导入失败",
                description: `${(e as Error).message}`,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>导入预设</DialogTitle>
                    <DialogDescription>在这里，可以导入之前从本工具导出的预设数据。</DialogDescription>
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
                                        <FormLabel>预设文件</FormLabel>
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
                                取消
                            </Button>
                            <Button type="submit">导入</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
