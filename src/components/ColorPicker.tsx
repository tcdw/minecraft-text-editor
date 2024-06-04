import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { BUILTIN_COLOR } from "@/constants/colors.ts";
import styles from "./ColorPicker.module.scss";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input.tsx";
import { PropsWithChildren, ReactNode, useEffect, useId, useState } from "react";

const hexRGBRegex = /^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export interface ColorPickerProps {
    value: string;
    onValueChange?: (color: string) => void;
    extraAction?: ReactNode;
}

export default function ColorPicker({
    value,
    onValueChange,
    children,
    extraAction,
}: PropsWithChildren<ColorPickerProps>) {
    const [currentColorTab, setCurrentColorTab] = useState("builtin");
    const [currentColorCustom, setCurrentColorCustom] = useState("#66ccff");
    const colorInputId = useId();
    const [open, setOpen] = useState(false);

    // Sync editor color value after parent value changes
    useEffect(() => {
        let canceled = false;
        setCurrentColorCustom(value);
        setOpen(false);
        setTimeout(() => {
            if (canceled) {
                return;
            }
            setCurrentColorTab("builtin");
        }, 200);
        return () => {
            canceled = true;
        };
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children ?? (
                    <Button variant={"ghost"} size={"icon"} aria-label="Text Color">
                        {/*<PaintBucket className={"size-4"} />*/}
                        <div className={"rounded-full size-4"} style={{ background: value }} aria-hidden />
                    </Button>
                )}
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
                                        onValueChange?.(e);
                                    }}
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="custom" className={styles.customColorSelect}>
                        <HexColorPicker color={currentColorCustom} onChange={setCurrentColorCustom} />
                        <div className={"mt-3 flex gap-3"}>
                            <label className={"sr-only"} htmlFor={colorInputId}>
                                HEX 颜色
                            </label>
                            <Input
                                className={"flex-auto"}
                                id={colorInputId}
                                value={currentColorCustom}
                                onInput={e => setCurrentColorCustom(e.currentTarget.value)}
                            />
                            <Button
                                className={"flex-none"}
                                type={"button"}
                                onClick={() => {
                                    if (currentColorCustom.startsWith("#")) {
                                        onValueChange?.(currentColorCustom);
                                        return;
                                    }
                                    onValueChange?.("#" + currentColorCustom);
                                }}
                                disabled={!hexRGBRegex.test(currentColorCustom)}
                            >
                                确定
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
                {extraAction && <div className={"mt-3"}>{extraAction}</div>}
            </PopoverContent>
        </Popover>
    );
}
