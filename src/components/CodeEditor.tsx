import { Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCallback, useRef, useState } from "react";
import { fromMinecraftString, parseFromHTML, toMinecraftString } from "@/lib/parser.ts";
import { $generateHtmlFromNodes } from "@lexical/html";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { setStringItems } from "@/lib/editor.ts";

export default function CodeEditor() {
    const [content, setContent] = useState("");
    const [editor] = useLexicalComposerContext();
    const editorFocus = useRef(false);

    const handleUpdate = useCallback(() => {
        editor.update(() => {
            setContent(toMinecraftString(parseFromHTML($generateHtmlFromNodes(editor, null))));
        });
    }, [editor]);

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
            <label htmlFor={"gen-code"} className={"flex items-center py-2 px-2 gap-3"}>
                <Code className={"text-muted-foreground size-5"} />
                <span className={"text-lg font-bold leading-normal"}>生成的代码</span>
            </label>
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
