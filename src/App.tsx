/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Code } from "lucide-react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { parseFromHTML, toMinecraftString } from "@/lib/parser.ts";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useState } from "react";
import { ExtendedTextNode } from "@/lib/ExtendedTextNode.ts";
import { TextNode } from "lexical";

function Placeholder() {
    return (
        <div className="p-3 absolute top-0 left-0 text-neutral-500 pointer-events-none" aria-hidden={true}>
            在这里输入你的内容……
        </div>
    );
}

const editorConfig = {
    namespace: "React.js Demo",
    nodes: [ExtendedTextNode, { replace: TextNode, with: (node: TextNode) => new ExtendedTextNode(node.__text) }],
    // Handling of errors during update
    onError(error: Error) {
        throw error;
    },
    // The editor theme
    theme: ExampleTheme,
};

export default function App() {
    const [content, setContent] = useState("");

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={"container py-4 max-w-screen-lg"}>
                <div className="border rounded-xl p-2 flex flex-col items-stretch gap-2">
                    <ToolbarPlugin />
                    <div className="relative">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="min-h-16 p-3 rounded-md editor-theme-dark" />}
                            placeholder={<Placeholder />}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ClearEditorPlugin />
                        <OnChangePlugin
                            onChange={(_, editor) => {
                                editor.update(() => {
                                    setContent(toMinecraftString(parseFromHTML($generateHtmlFromNodes(editor, null))));
                                });
                            }}
                        />
                    </div>
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
                </div>
            </div>
        </LexicalComposer>
    );
}
