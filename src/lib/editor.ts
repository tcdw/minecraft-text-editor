import { $getRoot, $getSelection, $insertNodes, LexicalEditor } from "lexical";
import { MinecraftStringItem, stringItemsToHTML } from "@/lib/parser.ts";
import { $generateNodesFromDOM } from "@lexical/html";

export function setStringItems(editor: LexicalEditor, treeOrHTML: MinecraftStringItem[][] | string, insert = false) {
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
