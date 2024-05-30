import { $getRoot, $insertNodes, LexicalEditor, TextNode } from "lexical";
import { MinecraftStringItem, stringItemsToHTML } from "@/lib/parser.ts";
import { $generateNodesFromDOM } from "@lexical/html";

export function setStringItems(editor: LexicalEditor, tree: MinecraftStringItem[]) {
    editor.update(() => {
        const dom = new DOMParser().parseFromString(stringItemsToHTML(tree), "text/html");

        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom);

        // Manually write color information to AST
        // Workaround of https://github.com/facebook/lexical/issues/3042
        nodes.forEach((e, i) => {
            const color = tree[i].color;
            if (e instanceof TextNode && color) {
                e.setStyle(`color: ${color}`);
            }
        });

        // Clear existing content
        const root = $getRoot();
        root.clear();

        // Select the root
        $getRoot().select();

        // Insert them at a selection.
        $insertNodes(nodes);
    });
}
