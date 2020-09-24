/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable lines-between-class-members */

import rgb2hex from 'rgb2hex';

export interface StringItem {
    text: string;
    color: string | null;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

export class TextEditor {
    public content: HTMLElement;
    private currentDefaultColor: string;
    public static builtinColor = [
        '000000',
        '0000aa',
        '00aa00',
        '00aaaa',
        'aa0000',
        'aa00aa',
        'ffaa00',
        'aaaaaa',
        '555555',
        '5555ff',
        '55ff55',
        '55ffff',
        'ff5555',
        'ff55ff',
        'ffff55',
        'ffffff',
    ];

    constructor(content: HTMLElement) {
        this.content = content;
        this.currentDefaultColor = '#ffffff';
    }
    /**
     * 检查某个元素是否会渲染出下划线或删除线样式
     * @param el 要开始搜索的节点
     * @param root 根节点（停止搜索的地方）
     * @param name 搜索的关键词
     * @returns 是否会渲染
     */
    static searchLineStyle(el: HTMLElement, root: HTMLElement, name: string): boolean {
        if (el === null) {
            return false;
        }
        const styles = window.getComputedStyle(el);
        if (styles.textDecorationLine.includes(name)) {
            return true;
        }
        if (el.isEqualNode(root)) {
            return false;
        }
        return TextEditor.searchLineStyle(el.parentNode as HTMLElement, root, name);
    }

    /**
     * 解析 HTML 多彩文本为结构化数据
     * @param el 包含要进行解析的文本的元素
     * @param root 根节点
     * @returns 解析结果
     */
    parse(el: HTMLElement, root: HTMLElement = el) {
        let item: StringItem[] = [];
        el.childNodes.forEach((e) => {
            if (e.nodeType === Node.TEXT_NODE) {
                const styles = window.getComputedStyle(el);
                const { color } = styles;
                const bold = Number(styles.fontWeight) >= 700;
                const italic = (styles.fontStyle === 'italic') || (styles.fontStyle === 'oblique');
                // const parentStyles = window.getComputedStyle(el.parentNode as HTMLElement);
                const underline = TextEditor.searchLineStyle(el, root, 'underline');
                const strikethrough = TextEditor.searchLineStyle(el, root, 'line-through');
                const text = `${e.nodeValue}`;
                const iterator = text[Symbol.iterator]();
                let char = iterator.next();
                while (!char.done) {
                    item.push({
                        text: char.value,
                        color,
                        bold,
                        italic,
                        underline,
                        strikethrough,
                    });
                    char = iterator.next();
                }
            } else if (e.nodeType === Node.ELEMENT_NODE) {
                item = item.concat(this.parse(e as HTMLElement, root));
            }
        });
        return item;
    }

    parseFromFragment(
        df: DocumentFragment,
    ) {
        const temp = document.createElement('div');
        temp.style.color = this.currentDefaultColor;
        temp.appendChild(df);
        document.body.appendChild(temp);
        const tree = this.parse(temp);
        document.body.removeChild(temp);
        return tree;
    }

    /**
     * 优化多彩文本数据结构
     * @param item 需要优化的数据结构
     * @returns 优化结果
     */
    static optimizeTree(item: StringItem[]) {
        let i = 0;
        while (i < item.length) {
            if (i <= 0) {
                i = 1;
                continue;
            }
            if (item[i].color === item[i - 1].color
                && item[i].bold === item[i - 1].bold
                && item[i].italic === item[i - 1].italic
                && item[i].strikethrough === item[i - 1].strikethrough
                && item[i].underline === item[i - 1].underline) {
                item[i - 1].text += item[i].text;
                item.splice(i, 1);
                continue;
            }
            i += 1;
        }
    }

    /**
     * 从多彩文本数据结构渲染 HTML
     * @param item 需要优化的数据结构
     * @param target 需要插入渲染结果的 HTML 元素
     * @returns 需要插入渲染结果的 HTML 元素
     */
    static randerFromTree(item: StringItem[], target: Element) {
        item.forEach((e) => {
            const span = document.createElement('span') as HTMLSpanElement;
            span.textContent = e.text;
            if (e.color !== null) {
                span.style.color = e.color;
                span.style.textDecorationColor = e.color;
            }
            if (e.bold) {
                span.style.fontWeight = '700';
            }
            const line: string[] = [];
            if (e.underline) {
                line.push('underline');
            }
            if (e.strikethrough) {
                line.push('line-through');
            }
            span.style.textDecorationLine = line.join(' ');
            if (e.italic) {
                span.style.fontStyle = 'italic';
            }
            target.appendChild(span);
        });
        return target;
    }

    /**
     * 优化文本框中已有的内容
     * @param el 文本框
     * @param target 输出目标
     * @returns 优化结果的文本数据结构
     */
    strip(el: HTMLElement = this.content, target?: Element) {
        const textTree = this.parse(el);
        while (el.lastChild !== null) {
            el.removeChild(el.lastChild);
        }
        TextEditor.randerFromTree(textTree, target || el);
        return textTree;
    }

    /**
     * 将文本数据结构转换为 Minecraft EssentialsX 表记
     * @returns 表记
     */
    toMinecraftString() {
        const item = this.parse(this.content);
        TextEditor.optimizeTree(item);
        let result = '';
        item.forEach((e, i) => {
            if (i <= 0
                || e.color !== item[i - 1].color
                || (!e.bold && item[i - 1].bold)
                || (!e.strikethrough && item[i - 1].strikethrough)
                || (!e.underline && item[i - 1].underline)
                || (!e.italic && item[i - 1].italic)) {
                if (e.color === null || this.currentDefaultColor === rgb2hex(e.color).hex) {
                    result += '&r';
                } else {
                    const hexColor = rgb2hex(e.color).hex;
                    for (let j = 0; j < TextEditor.builtinColor.length; j += 1) {
                        if (hexColor === `#${TextEditor.builtinColor[j]}`) {
                            result += `&${j.toString(16)}`;
                            break;
                        }
                        if (j >= TextEditor.builtinColor.length - 1) {
                            result += `&${hexColor}`;
                        }
                    }
                }
            }
            if (e.bold) {
                result += '&l';
            }
            if (e.strikethrough) {
                result += '&m';
            }
            if (e.underline) {
                result += '&n';
            }
            if (e.italic) {
                result += '&o';
            }
            let content = e.text;
            content = content.replace(/&#[0-9a-fA-F]{6}/g, (match) => `&${match}`);
            content = content.replace(/&[0-9a-f]/g, (match) => `&${match}`);
            content = content.replace(/&l/g, '&&l');
            content = content.replace(/&m/g, '&&m');
            content = content.replace(/&n/g, '&&n');
            content = content.replace(/&o/g, '&&o');
            content = content.replace(/&k/g, '&&k');
            result += content;
        });
        return result;
    }

    /**
     * 剪切用户选区
     * @returns 剪切下来的用户选区的文本数据结构
     */
    cutSelection(): StringItem[] {
        const selection = document.getSelection() as Selection;
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const extracted = range.extractContents();
            // range.insertNode(extracted);
            if (extracted.childNodes.length === 1
                && extracted.childNodes[0].nodeType === Node.TEXT_NODE) {
                const parent = range.commonAncestorContainer.parentElement;
                if (parent) {
                    const nc = document.createElement('span');
                    nc.style.color = parent.style.color;
                    nc.style.fontWeight = parent.style.fontWeight;
                    nc.style.fontStyle = parent.style.fontStyle;
                    nc.style.textDecorationLine = parent.style.textDecorationLine;
                    nc.style.textDecorationColor = parent.style.textDecorationColor;
                    parent.style.cssText = '';
                    nc.textContent = extracted.childNodes[0].textContent;
                    extracted.childNodes[0].remove();
                    extracted.appendChild(nc);
                }
            }
            const tree = this.parseFromFragment(extracted);
            return tree;
        }
        return [];
    }

    /**
     * 在指定选区插入内容
     * @param data 要被插入的内容
     */
    static insertContent(data: string | HTMLElement | StringItem[]) {
        let temp: Element;
        if (typeof data === 'string') {
            temp = document.createElement('span');
            temp.textContent = data;
        } else if (Array.isArray(data)) {
            temp = document.createElement('span');
            TextEditor.randerFromTree(data, temp);
        } else {
            temp = data;
        }
        let range: Range;
        const sel = window.getSelection() as Selection;
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(temp);
        }
    }

    static saveSelection() {
        // https://gist.github.com/dantaex/543e721be845c18d2f92652c0ebe06aa
        const sel = window.getSelection();
        if (sel && sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
        return null;
    }

    static restoreSelection(range: Range | null) {
        // https://gist.github.com/dantaex/543e721be845c18d2f92652c0ebe06aa
        const sel = window.getSelection();
        if (range && sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    /**
     * 寻找一个节点是否存在某父元素
     * @param node 节点
     * @param root 要寻找的根元素的 CSS 选择器
     */
    static rootLookup(node: Node | HTMLElement, root: string) {
        let start: Node | HTMLElement = node;
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentElement === null) {
                return false;
            }
            start = node.parentElement;
        }
        if ((start as HTMLElement).closest(root)) {
            return true;
        }
        return false;
    }

    /**
     * 检查用户选区是否在编辑器内
     */
    isSelectedInBox(sel?: Selection) {
        const selection = sel || document.getSelection();
        const { id } = this.content;
        if (selection?.anchorNode && selection?.focusNode) {
            if (TextEditor.rootLookup(selection?.anchorNode, `#${id}`)
                && TextEditor.rootLookup(selection?.focusNode, `#${id}`)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 对用户选区设置样式
     * @param type 样式类型
     */
    setStyle(type: 'bold' | 'italic' | 'underline' | 'strikethrough') {
        if (!this.isSelectedInBox()) {
            return;
        }
        const selection = this.cutSelection();
        let apply = false;
        for (let i = 0; i < selection.length; i += 1) {
            if (!selection[i].text) {
                continue;
            }
            if (!selection[i][type]) {
                apply = true;
                break;
            }
        }
        for (let i = 0; i < selection.length; i += 1) {
            selection[i][type] = apply;
        }
        TextEditor.insertContent(selection);
    }

    /**
     * 对用户选区设置颜色
     * @param color 颜色
     */
    setColor(color: string) {
        if (!this.isSelectedInBox()) {
            return;
        }
        const selection = this.cutSelection();
        for (let i = 0; i < selection.length; i += 1) {
            selection[i].color = color;
        }
        TextEditor.insertContent(selection);
    }

    get defaultColor() {
        return this.currentDefaultColor;
    }
}

export default TextEditor;
