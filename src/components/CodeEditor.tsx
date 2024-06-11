import { Braces, Check, Code, Copy, MessageSquareText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCallback, useRef, useState } from "react";
import { exportFromMinecraftStringLine, fromMinecraftString, parseFromHTML, toMinecraftString } from "@/lib/parser.ts";
import { $generateHtmlFromNodes } from "@lexical/html";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { setStringItems } from "@/lib/editor.ts";
import { useClipboard } from "foxact/use-clipboard";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/ui/use-toast.ts";
import { MinecraftTextFragment } from "@/types/main";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CodeEditor() {
    const [content, setContent] = useState("");
    const [jsonObject, setJsonObject] = useState<MinecraftTextFragment[][]>([]);
    const [editor] = useLexicalComposerContext();
    const editorFocus = useRef(false);

    const handleUpdate = useCallback(() => {
        editor.update(() => {
            const obj = parseFromHTML($generateHtmlFromNodes(editor, null));
            setJsonObject(obj);
            setContent(toMinecraftString(obj));
        });
    }, [editor]);

    const { copy, copied } = useClipboard({
        timeout: 1500,
        usePromptAsFallback: false,
        promptFallbackText: "请从以下文本框手动复制文本内容：",
        onCopyError(e) {
            toast({
                title: "复制失败了！",
                description: e.message,
            });
        },
    });

    return (
        <>
            <OnChangePlugin
                onChange={() => {
                    if (editorFocus.current) {
                        return;
                    }
                    handleUpdate();
                }}
            />
            <div className={"flex items-center"}>
                <label htmlFor={"gen-code"} className={"flex-auto flex items-center py-2 px-2 gap-3"}>
                    <Code className={"text-muted-foreground size-5"} />
                    <span className={"text-lg font-bold leading-normal"}>生成的代码</span>
                </label>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className={"flex-none"}>
                            {copied ? <Check className={"size-4 me-2"} /> : <Copy className={"size-4 me-2"} />}
                            {copied ? "复制成功" : "复制"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>请选择复制的格式</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={useCallback(() => copy(content), [copy, content])}>
                            <MessageSquareText className={"size-4 me-2"} />
                            格式化代码 (EssentialsX)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={useCallback(
                                () => copy(JSON.stringify(exportFromMinecraftStringLine(jsonObject))),
                                [copy, content],
                            )}
                        >
                            <Braces className={"size-4 me-2"} />
                            原始 JSON 文本格式
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Textarea
                id={"gen-code"}
                className={"font-mono h-24"}
                value={content}
                onInput={e => {
                    setContent(e.currentTarget.value);
                    setStringItems(editor, fromMinecraftString(e.currentTarget.value));
                }}
                onFocus={() => {
                    editor.setEditable(false);
                    editorFocus.current = true;
                }}
                onBlur={() => {
                    editor.setEditable(true);
                    editorFocus.current = false;
                    handleUpdate();
                }}
            />
            <div className={"text-sm flex items-center justify-end px-1"}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={"flex items-center gap-1 cursor-help"}>
                                <div
                                    className={content.length >= 240 ? "text-red-500" : "text-muted-foreground"}
                                >{`当前字符数：${content.length}`}</div>
                                {content.length >= 240 ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1rem"
                                        height="1rem"
                                        viewBox="0 0 64 64"
                                    >
                                        <path
                                            fill="#ffdd15"
                                            d="M63.37 53.52C53.982 36.37 44.59 19.22 35.2 2.07a3.687 3.687 0 0 0-6.522 0C19.289 19.22 9.892 36.37.508 53.52c-1.453 2.649.399 6.083 3.258 6.083h56.35c1.584 0 2.648-.853 3.203-2.01c.698-1.102.885-2.565.055-4.075"
                                        />
                                        <path
                                            fill="#1f2e35"
                                            d="m28.917 34.477l-.889-13.262c-.166-2.583-.246-4.439-.246-5.565c0-1.534.4-2.727 1.202-3.588c.805-.856 1.863-1.286 3.175-1.286c1.583 0 2.646.551 3.178 1.646c.537 1.102.809 2.684.809 4.751c0 1.215-.066 2.453-.198 3.708l-1.19 13.649c-.129 1.626-.404 2.872-.827 3.739c-.426.871-1.128 1.301-2.109 1.301c-.992 0-1.69-.419-2.072-1.257c-.393-.841-.668-2.12-.833-3.836m3.072 18.217c-1.125 0-2.106-.362-2.947-1.093c-.841-.728-1.26-1.748-1.26-3.058c0-1.143.4-2.12 1.202-2.921c.805-.806 1.786-1.206 2.951-1.206s2.153.4 2.977 1.206c.815.801 1.234 1.778 1.234 2.921c0 1.29-.419 2.308-1.246 3.044a4.245 4.245 0 0 1-2.911 1.107"
                                        />
                                    </svg>
                                ) : null}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className={"text-sm space-y-1"}>
                            <p>Minecraft 的聊天框最多只能输入 256 个字符。</p>
                            <p>大量的使用样式（特别是 RGB 颜色）会导致代码字符数迅速上升。</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {process.env.NODE_ENV === "development" && (
                <pre className={"break-all whitespace-pre-wrap text-sm"}>{JSON.stringify(jsonObject, null, 2)}</pre>
            )}
        </>
    );
}
