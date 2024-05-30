/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    // FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    LexicalEditor,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { $patchStyleText } from "@lexical/selection";
import { Button } from "@/components/ui/button.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { Bold, Italic, PaintBucket, Redo, Strikethrough, Underline, Undo } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { BUILTIN_COLOR } from "@/constants/colors.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

const LowPriority = 1;

function applyTextColor(editor: LexicalEditor, color: string) {
    editor.update(() => {
        const selection = $getSelection();
        if (selection) {
            $patchStyleText(selection, { color });
        }
    });
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const [currentColorTab, setCurrentColorTab] = useState("built-in");

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                payload => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                payload => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, $updateToolbar]);

    return (
        <div className="flex gap-1" ref={toolbarRef}>
            <Button
                variant={"ghost"}
                size={"icon"}
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                aria-label="Undo"
            >
                <Undo className={"size-4"} />
            </Button>
            <Button
                variant={"ghost"}
                size={"icon"}
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                aria-label="Redo"
            >
                <Redo className={"size-4"} />
            </Button>
            <Toggle
                pressed={isBold}
                onPressedChange={setIsBold}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
                aria-label="Format Bold"
            >
                <Bold className={"size-4"} />
            </Toggle>
            <Toggle
                pressed={isItalic}
                onPressedChange={setIsItalic}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
                aria-label="Format Italics"
            >
                <Italic className={"size-4"} />
            </Toggle>
            <Toggle
                pressed={isUnderline}
                onPressedChange={setIsUnderline}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
                aria-label="Format Underline"
            >
                <Underline className={"size-4"} />
            </Toggle>
            <Toggle
                pressed={isStrikethrough}
                onPressedChange={setIsStrikethrough}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
                aria-label="Format Strikethrough"
            >
                <Strikethrough className={"size-4"} />
            </Toggle>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} aria-label="Text Color">
                        <PaintBucket className={"size-4"} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3">
                    <Tabs className="w-full" value={currentColorTab} onValueChange={setCurrentColorTab}>
                        <TabsList className="grid w-full grid-cols-2 mb-3">
                            <TabsTrigger value="builtin">内置</TabsTrigger>
                            <TabsTrigger value="custom">自定义</TabsTrigger>
                        </TabsList>
                        <TabsContent value="builtin">
                            <div className="grid grid-cols-8 gap-1.5">
                                {BUILTIN_COLOR.map((e, i) => (
                                    <button
                                        type={"button"}
                                        key={e}
                                        className={`w-full aspect-square rounded-md ${i === BUILTIN_COLOR.length - 1 ? "border" : ""}`}
                                        style={{ background: e }}
                                        onClick={() => {
                                            applyTextColor(editor, e);
                                        }}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="custom">222</TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
            {/*<button
                onClick={() => {
                    applyTextColor(editor, "#ff0000");
                }}
                className={"toolbar-item"}
                aria-label="Format Strikethrough"
            >
                red
            </button>
            <button
                onClick={() => {
                    applyTextColor(editor, "#00ff00");
                }}
                className={"toolbar-item"}
                aria-label="Format Strikethrough"
            >
                green
            </button>
            <button
                onClick={() => {
                    applyTextColor(editor, "#0000ff");
                }}
                className={"toolbar-item"}
                aria-label="Format Strikethrough"
            >
                glue
            </button>*/}
        </div>
    );
}
