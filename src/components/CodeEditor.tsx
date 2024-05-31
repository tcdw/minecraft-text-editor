import { Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useState } from "react";
import { parseFromHTML, toMinecraftString } from "@/lib/parser.ts";
import { $generateHtmlFromNodes } from "@lexical/html";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

export default function CodeEditor() {
    const [content, setContent] = useState("");

    return (
        <>
            <OnChangePlugin
                onChange={(_, editor) => {
                    editor.update(() => {
                        setContent(toMinecraftString(parseFromHTML($generateHtmlFromNodes(editor, null))));
                    });
                }}
            />
            <label htmlFor={"gen-code"} className={"flex items-center py-2 px-2 gap-3"}>
                <Code className={"text-muted-foreground size-5"} />
                <span className={"text-lg font-bold leading-normal"}>生成的代码</span>
            </label>
            <Textarea
                id={"gen-code"}
                className={"font-mono"}
                value={content}
                onInput={e => setContent(e.currentTarget.value)}
            />
        </>
    );
}
