import { $getRoot, $getSelection, $insertNodes, LexicalEditor } from "lexical";
import { stringItemsToHTML } from "@/lib/parser.ts";
import { $generateNodesFromDOM } from "@lexical/html";
import { MinecraftTextFragment } from "@/types/main";

export function setStringItems(editor: LexicalEditor, treeOrHTML: MinecraftTextFragment[][] | string, insert = false) {
    editor.update(() => {
        const html = typeof treeOrHTML === "string" ? treeOrHTML : stringItemsToHTML(treeOrHTML);
        const dom = new DOMParser().parseFromString(html, "text/html");

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
