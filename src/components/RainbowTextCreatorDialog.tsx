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
import { Dices, FileCog, Rainbow, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
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
import useRainbowActionsStore from "@/store/rainbowActions.ts";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const FormSchema = z.object({
    text: z.string(),
    colors: z.array(z.string()).refine(val => val.length >= 2, {
        message: i18n.t("rainbow.minColors"),
    }),
});

export interface RainbowTextCreatorDialogProps {
    onInsert: (content: string) => void;
}

export default function RainbowTextCreatorDialog({ onInsert }: RainbowTextCreatorDialogProps) {
    const [open, setOpen] = useState(false);
    const id = useId();
    const { t } = useTranslation();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
            colors: [randomHexColor(), randomHexColor()],
        },
    });

    // rainbow preset
    const [namingOpen, setNamingOpen] = useState(false);
    const { addPreset } = usePresetsStore();
    const { setPresetDialogOpen, presetDemand, setPresetDemand } = useRainbowActionsStore();
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
    const { editorTheme } = useSettingsStore();
    const actualTheme = EDITOR_COLOR.find(e => e.value === editorTheme) || EDITOR_COLOR[0];

    // preview field
    const [preview, setPreview] = useState("");

    function onSubmit() {
        onInsert(preview);
        setOpen(false);
    }

    function handlePreviewUpdate(text: string) {
        const table = createGradientColor({
            colors: form.getValues("colors"),
            text,
        });
        setPreview(measuredStringColorToHTML(table));
    }

    function handleRandom() {
        const amount = form.getValues("colors").length;
        form.setValue(
            "colors",
            new Array(amount).fill("").map(() => randomHexColor()),
        );
        handlePreviewUpdate(form.getValues("text"));
    }

    function handlePresetSubmit(name: string) {
        addPreset({ id: v4(), name, colors: form.getValues("colors") });
        toast.success(t("rainbow.presetSaved"), {
            description: t("rainbow.newPreset", { name }),
        });
    }

    const formFields = (
        <>
            <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("rainbow.textContent")}</FormLabel>
                        <FormControl>
                            <Input
                                placeholder=""
                                {...field}
                                onChange={e => {
                                    handlePreviewUpdate(e.currentTarget.value);
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
                        <FormLabel>{t("rainbow.gradientColors")}</FormLabel>
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
                                        <Save className={"size-4"} />
                                        {t("rainbow.savePreset")}
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        type={"button"}
                                        onClick={() => setPresetDialogOpen(true)}
                                    >
                                        <FileCog className={"size-4"} />
                                        {t("rainbow.presetManagement")}
                                    </Button>
                                    <Button variant={"outline"} type={"button"} onClick={() => handleRandom()}>
                                        <Dices className={"size-4"} />
                                        {t("rainbow.feelingLucky")}
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
                    {t("rainbow.preview")}
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
                    <Button variant={"ghost"} size={"icon"} aria-label={t("rainbow.insertGradientText")}>
                        <Rainbow className={"size-4"} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[768px] max-h-screen sm:max-h-[calc(100dvh-2rem)]">
                    <DialogHeader>
                        <DialogTitle>{t("rainbow.insertGradientText")}</DialogTitle>
                        <DialogDescription>{t("rainbow.createGradientDescription")}</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {formFields}
                            <DialogFooter className={"mt-6"}>
                                <Button type="submit">{t("rainbow.insertText")}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <RainbowNameDialog
                open={namingOpen}
                onOpenChange={setNamingOpen}
                onSubmit={handlePresetSubmit}
                title={t("rainbow.createPreset")}
                description={t("rainbow.createPresetDescription")}
            />
        </>
    );
}
