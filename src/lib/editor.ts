import { $getRoot, $getSelection, $insertNodes, LexicalEditor } from "lexical";
import { MinecraftStringItem, stringItemsToHTML } from "@/lib/parser.ts";
import { $generateNodesFromDOM } from "@lexical/html";

export function setStringItems(editor: LexicalEditor, tree: MinecraftStringItem[][], insert = false) {
    editor.update(() => {
        const dom = new DOMParser().parseFromString(stringItemsToHTML(tree), "text/html");

        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom);

        if (insert) {
            $getSelection()?.insertNodes(nodes);
        } else {
            const root = $getRoot();
            // Clear existing content
            root.clear();
            // Select the root
            root.select();
            // Insert them at a selection.
            $insertNodes(nodes);
        }
    });
}
