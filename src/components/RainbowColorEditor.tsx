import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import ColorPicker from "@/components/ColorPicker.tsx";
import { randomHexColor } from "@/lib/colors.ts";

export interface RainbowColorEditorProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export default function RainbowColorEditor({ value, onChange }: RainbowColorEditorProps) {
    function handleAdd() {
        const newValue = value.concat();
        newValue.push(randomHexColor());
        onChange(newValue);
    }

    function handleChange(index: number, to: string) {
        const newValue = value.concat();
        newValue[index] = to;
        onChange(newValue);
    }

    function handleDelete(index: number) {
        const newValue = value.concat();
        newValue.splice(index, 1);
        onChange(newValue);
    }

    return (
        <div className={"flex items-center gap-2 flex-wrap"}>
            {value.map((e, i) => (
                <ColorPicker
                    key={i}
                    value={e}
                    onValueChange={color => handleChange(i, color)}
                    extraAction={
                        <Button
                            variant={"destructive"}
                            className={"w-full"}
                            onClick={() => handleDelete(i)}
                            disabled={value.length <= 2}
                            type={"button"}
                        >
                            <Trash2 className={"size-4 me-2"} />
                            删除
                        </Button>
                    }
                >
                    <Button type={"button"} variant={"outline"} className={"px-2 h-10"}>
                        <div className={"size-5 rounded-sm"} style={{ background: e }}></div>
                        <ChevronDown className={"size-4 ms-2"} />
                    </Button>
                </ColorPicker>
            ))}
            <Button type={"button"} variant={"outline"} size={"icon"} onClick={handleAdd}>
                <Plus className={"size-4"} />
            </Button>
        </div>
    );
}
