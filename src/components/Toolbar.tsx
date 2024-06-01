import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from "@lexical/utils";
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_TEXT_COMMAND,
    LexicalEditor,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    TextNode,
    UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { $patchStyleText } from "@lexical/selection";
import { Button } from "@/components/ui/button.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { Bold, Italic, Redo, RemoveFormatting, Strikethrough, Underline, Undo } from "lucide-react";
import ColorPicker from "@/components/ColorPicker.tsx";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

const LowPriority = 1;

function applyTextColor(editor: LexicalEditor, color: string) {
    editor.update(() => {
        const selection = $getSelection();
        if (selection) {
            $patchStyleText(selection, { color });
        }
    });
}

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

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

    const clearFormatting = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchor = selection.anchor;
                const focus = selection.focus;
                const nodes = selection.getNodes();

                if (anchor.key === focus.key && anchor.offset === focus.offset) {
                    return;
                }

                nodes.forEach((node, idx) => {
                    // We split the first and last node by the selection
                    // So that we don't format unselected text inside those nodes
                    if ($isTextNode(node)) {
                        if (idx === 0 && anchor.offset !== 0) {
                            node = node.splitText(anchor.offset)[1] || node;
                        }
                        if (idx === nodes.length - 1) {
                            node = (node as TextNode).splitText(focus.offset)[0] || node;
                        }

                        if ((node as TextNode).__style !== "") {
                            (node as TextNode).setStyle("");
                        }
                        if ((node as TextNode).__format !== 0) {
                            (node as TextNode).setFormat(0);
                            $getNearestBlockElementAncestorOrThrow(node).setFormat("");
                        }
                    } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
                        node.replace($createParagraphNode(), true);
                    } else if ($isDecoratorBlockNode(node)) {
                        node.setFormat("");
                    }
                });
            }
        });
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
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
            <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                    clearFormatting();
                }}
                aria-label="Clear Styling"
            >
                <RemoveFormatting className={"size-4"} />
            </Button>
            <ColorPicker
                onDone={e => {
                    applyTextColor(editor, e);
                }}
            />
        </div>
    );
}
