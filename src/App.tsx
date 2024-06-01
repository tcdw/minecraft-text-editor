import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";

import ExampleTheme from "./ExampleTheme";
import Toolbar from "./components/Toolbar.tsx";
import { ExtendedTextNode } from "@/lib/extendedTextNode.ts";
import { TextNode } from "lexical";
import CodeEditor from "@/components/CodeEditor.tsx";
import About from "@/components/About.tsx";
import useSettingsStore from "@/store/settings.ts";
import { EDITOR_COLOR } from "@/constants/colors.ts";

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
    const { editorTheme } = useSettingsStore(state => ({
        editorTheme: state.editorTheme,
    }));

    const actualTheme = EDITOR_COLOR.find(e => e.value === editorTheme) || EDITOR_COLOR[0];

    return (
        <LexicalComposer initialConfig={editorConfig}>
            {/* Outer Frame */}
            <div className={"container py-4 max-w-screen-lg"}>
                {/* Title */}
                <header className={"contents"}>
                    <h1 className={"font-bold text-2xl leading-normal mb-4 flex justify-center"}>
                        A Text Editor for Minecraft
                    </h1>
                </header>
                {/* Editor */}
                <main className={"contents"}>
                    <div className="border rounded-xl p-2 flex flex-col items-stretch gap-2">
                        <Toolbar />
                        <div className="relative">
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable
                                        className="min-h-16 p-3 rounded-md"
                                        style={{
                                            background: actualTheme.background,
                                            color: actualTheme.foreground,
                                        }}
                                    />
                                }
                                placeholder={
                                    <div
                                        className="p-3 absolute top-0 left-0 opacity-50 pointer-events-none"
                                        style={{
                                            color: actualTheme.foreground,
                                        }}
                                        aria-hidden={true}
                                    >
                                        在这里输入你的内容……
                                    </div>
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <HistoryPlugin />
                            <AutoFocusPlugin />
                            <ClearEditorPlugin />
                        </div>
                        <CodeEditor />
                    </div>
                    <div className={"py-6"}>
                        <About />
                    </div>
                </main>
                <footer className={"text-muted-foreground leading-relaxed text-md border-t mt-4 pt-4"}>
                    <p className={"text-center"}>
                        &copy; 2020-2024 tcdw. Released under MIT License.&nbsp;
                        <a
                            href={"https://github.com/tcdw/minecraft-text-editor"}
                            className={"text-foreground underline"}
                        >
                            Source
                        </a>
                    </p>
                    <p className={"text-center"}>
                        Minecraft<sup>®</sup> is a trademark of Microsoft Corporation.
                    </p>
                </footer>
            </div>
        </LexicalComposer>
    );
}
