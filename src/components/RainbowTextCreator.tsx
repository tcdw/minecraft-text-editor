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
import { Rainbow } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input.tsx";
import RainbowColorEditor from "@/components/RainbowColorEditor.tsx";
import { useId, useState } from "react";
import useSettingsStore from "@/store/settings.ts";
import { EDITOR_COLOR } from "@/constants/colors.ts";
import { randomHexColor } from "@/lib/colors.ts";
import { createGradientColor, measuredStringColorToHTML } from "@/lib/string.ts";

const FormSchema = z.object({
    text: z.string(),
    colors: z.array(z.string()).min(2, {
        message: "需要至少指定两种颜色",
    }),
});

export default function RainbowTextCreator() {
    const id = useId();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            text: "",
            colors: [randomHexColor(), randomHexColor()],
        },
    });

    const { editorTheme } = useSettingsStore(state => ({
        editorTheme: state.editorTheme,
    }));
    const actualTheme = EDITOR_COLOR.find(e => e.value === editorTheme) || EDITOR_COLOR[0];

    const [preview, setPreview] = useState("");

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"} aria-label="插入渐变文本">
                    <Rainbow className={"size-4"} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[768px]">
                <DialogHeader>
                    <DialogTitle>插入渐变文本</DialogTitle>
                    <DialogDescription>创建漂亮的渐变文本，并插入到编辑器中。</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        <RainbowColorEditor value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-2">
                            <div
                                id={`${id}_preview`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                效果预览
                            </div>
                            <div
                                aria-describedby={`${id}_preview`}
                                className="p-3 rounded-md"
                                style={{
                                    background: actualTheme.background,
                                    color: actualTheme.foreground,
                                }}
                                dangerouslySetInnerHTML={{ __html: preview }}
                            />
                        </div>
                        <DialogFooter className={"mt-6"}>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
