import { $getRoot, $getSelection, $insertNodes, LexicalEditor } from "lexical";
import { MinecraftStringItem, stringItemsToHTML } from "@/lib/parser.ts";
import { $generateNodesFromDOM } from "@lexical/html";

export function setStringItems(editor: LexicalEditor, tree: MinecraftStringItem[][], insert = false) {
    editor.update(() => {
        const dom = new DOMParser().parseFromString(stringItemsToHTML(tree), "text/html");

        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom);

        // Manually write color information to AST
        // Workaround of https://github.com/facebook/lexical/issues/3042
        /*for (let i = 0; i < nodes.length; i++) {
            const e = nodes[i];
            const color = tree[i].color;
            if (e instanceof TextNode && color) {
                e.setStyle(`color: ${color}`);
            }
        }*/

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
