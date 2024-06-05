import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileCog, Rainbow, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input.tsx";
import RainbowColorEditor from "@/components/RainbowColorEditor.tsx";
import { useEffect, useId, useState } from "react";
import useSettingsStore from "@/store/settings.ts";
import { EDITOR_COLOR } from "@/constants/colors.ts";
import { randomHexColor } from "@/lib/colors.ts";
import { createGradientColor, measuredStringColorToHTML } from "@/lib/string.ts";
import RainbowNameDialog from "@/components/RainbowNameDialog.tsx";
import usePresetsStore from "@/store/presets.ts";
import { v4 } from "uuid";
import { useShallow } from "zustand/react/shallow";
import useRainbowActionsStore from "@/store/rainbowActions.ts";

const FormSchema = z.object({
    text: z.string(),
    colors: z.array(z.string()).min(2, {
        message: "需要至少指定两种颜色",
    }),
});

export interface RainbowTextCreatorDialogProps {
    onInsert: (content: string) => void;
}

export default function RainbowTextCreatorDialog({ onInsert }: RainbowTextCreatorDialogProps) {
    const [open, setOpen] = useState(false);
    const id = useId();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
            colors: [randomHexColor(), randomHexColor()],
        },
    });

    // rainbow preset
    const [namingOpen, setNamingOpen] = useState(false);
    const { addPreset } = usePresetsStore(useShallow(state => ({ addPreset: state.addPreset })));
    const { setPresetDialogOpen, presetDemand, setPresetDemand } = useRainbowActionsStore(
        useShallow(state => ({
            setPresetDialogOpen: state.setPresetDialogOpen,
            presetDemand: state.presetDemand,
            setPresetDemand: state.setPresetDemand,
        })),
    );
    useEffect(() => {
        if (!presetDemand) {
            return;
        }
        form.setValue("colors", presetDemand);
        setPresetDemand(null);
        const table = createGradientColor({
            colors: form.getValues("colors"),
            text: form.getValues("text"),
        });
        setPreview(measuredStringColorToHTML(table));
    }, [presetDemand, setPresetDemand, form]);

    // editor theme
    const { editorTheme } = useSettingsStore(state => ({
        editorTheme: state.editorTheme,
    }));
    const actualTheme = EDITOR_COLOR.find(e => e.value === editorTheme) || EDITOR_COLOR[0];

    // preview field
    const [preview, setPreview] = useState("");

    function onSubmit() {
        onInsert(preview);
        setOpen(false);
    }

    function handlePresetSubmit(name: string) {
        addPreset({ id: v4(), name, colors: form.getValues("colors") });
        toast({
            title: "预设保存成功",
            description: `新的预设：${name}`,
        });
    }

    const formFields = (
        <>
            <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>文本内容</FormLabel>
                        <FormControl>
                            <Input
                                placeholder=""
                                {...field}
                                onChange={e => {
                                    const table = createGradientColor({
                                        colors: form.getValues("colors"),
                                        text: e.currentTarget.value,
                                    });
                                    setPreview(measuredStringColorToHTML(table));
                                    field.onChange(e);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>渐变色</FormLabel>
                        <FormControl>
                            <div>
                                <RainbowColorEditor
                                    value={field.value}
                                    onChange={e => {
                                        const table = createGradientColor({
                                            colors: e,
                                            text: form.getValues("text"),
                                        });
                                        setPreview(measuredStringColorToHTML(table));
                                        field.onChange(e);
                                    }}
                                />
                                <div className={"pt-2 flex items-center gap-2"}>
                                    <Button variant={"outline"} type={"button"} onClick={() => setNamingOpen(true)}>
                                        <Save className={"size-4 me-2"} />
                                        保存当前预设
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        type={"button"}
                                        onClick={() => setPresetDialogOpen(true)}
                                    >
                                        <FileCog className={"size-4 me-2"} />
                                        预设管理
                                    </Button>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="space-y-2">
                <div
                    id={`${id}_preview`}
                    className="inline-block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    效果预览
                </div>
                <div
                    aria-describedby={`${id}_preview`}
                    className="p-3 rounded-md min-h-12"
                    style={{
                        background: actualTheme.background,
                        color: actualTheme.foreground,
                    }}
                    dangerouslySetInnerHTML={{ __html: preview }}
                />
            </div>
        </>
    );

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} aria-label="插入渐变文本">
                        <Rainbow className={"size-4"} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[768px] max-h-screen sm:max-h-[calc(100dvh-2rem)]">
                    <DialogHeader>
                        <DialogTitle>插入渐变文本</DialogTitle>
                        <DialogDescription>创建漂亮的渐变文本，并插入到编辑器中。</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {formFields}
                            <DialogFooter className={"mt-6"}>
                                <Button type="submit">插入文本</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <RainbowNameDialog
                open={namingOpen}
                onOpenChange={setNamingOpen}
                onSubmit={handlePresetSubmit}
                title={"创建渐变预设"}
                description={"请输入新创建渐变预设的名称："}
            />
        </>
    );
}
