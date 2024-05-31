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
import { ExtendedTextNode } from "@/lib/extendedTextNode.ts";
import { TextNode } from "lexical";
import CodeEditor from "@/components/CodeEditor.tsx";

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
                    </div>
                    <CodeEditor />
                </div>
            </div>
        </LexicalComposer>
    );
}
