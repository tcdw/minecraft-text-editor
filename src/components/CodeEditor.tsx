import { Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCallback, useRef, useState } from "react";
import { fromMinecraftString, parseFromHTML, toMinecraftString } from "@/lib/parser.ts";
import { $generateHtmlFromNodes } from "@lexical/html";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { setStringItems } from "@/lib/editor.ts";
import { useClipboard } from "foxact/use-clipboard";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/use-toast.ts";

export default function CodeEditor() {
    const [content, setContent] = useState("");
    const [editor] = useLexicalComposerContext();
    const editorFocus = useRef(false);

    const handleUpdate = useCallback(() => {
        editor.update(() => {
            setContent(toMinecraftString(parseFromHTML($generateHtmlFromNodes(editor, null))));
        });
    }, [editor]);

    const { copy, copied } = useClipboard({
        timeout: 1500,
        usePromptAsFallback: false,
        promptFallbackText: "请从以下文本框手动复制文本内容：",
        onCopyError(e) {
            toast({
                title: "复制失败了！",
                description: e.message,
            });
        },
    });

    return (
        <>
            <OnChangePlugin
                onChange={() => {
                    if (editorFocus.current) {
                        return;
                    }
                    handleUpdate();
                }}
            />
            <div className={"flex items-center"}>
                <label htmlFor={"gen-code"} className={"flex-auto flex items-center py-2 px-2 gap-3"}>
                    <Code className={"text-muted-foreground size-5"} />
                    <span className={"text-lg font-bold leading-normal"}>生成的代码</span>
                </label>
                <Button className={"flex-none"} onClick={useCallback(() => copy(content), [copy, content])}>
                    {copied ? "复制成功" : "复制"}
                </Button>
            </div>
            <Textarea
                id={"gen-code"}
                className={"font-mono h-24"}
                value={content}
                onInput={e => {
                    setContent(e.currentTarget.value);
                    setStringItems(editor, fromMinecraftString(e.currentTarget.value));
                }}
                onFocus={() => {
                    editor.setEditable(false);
                    editorFocus.current = true;
                }}
                onBlur={() => {
                    editor.setEditable(true);
                    editorFocus.current = false;
                    handleUpdate();
                }}
            />
        </>
    );
}
