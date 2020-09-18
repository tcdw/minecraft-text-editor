// TODO: 进行处理

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */

import rgb2hex from 'rgb2hex';

const content = document.getElementById('content') as HTMLDivElement;
const parseBtn = document.getElementById('parse') as HTMLButtonElement;

const defaultColor = '#000000';

interface StringItem {
    text: string;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

function searchLineStyle(el: HTMLElement, root: HTMLElement, name: string): boolean {
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
    return searchLineStyle(el.parentNode as HTMLElement, root, name);
}

function parse(el: HTMLElement, root: HTMLElement = content) {
    let item: StringItem[] = [];
    el.childNodes.forEach((e) => {
        if (e.nodeType === Node.TEXT_NODE) {
            const styles = window.getComputedStyle(el);
            const { color } = styles;
            const bold = Number(styles.fontWeight) >= 700;
            const italic = (styles.fontStyle === 'italic') || (styles.fontStyle === 'oblique');
            // const parentStyles = window.getComputedStyle(el.parentNode as HTMLElement);
            const underline = searchLineStyle(el, root, 'underline');
            const strikethrough = searchLineStyle(el, root, 'line-through');
            item.push({
                text: e.nodeValue as string,
                color,
                bold,
                italic,
                underline,
                strikethrough,
            });
        } else if (e.nodeType === Node.ELEMENT_NODE) {
            item = item.concat(parse(e as HTMLElement, root));
        }
    });
    return item;
}

function optimizeTree(item: StringItem[]) {
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

function randerFromTree(item: StringItem[], target: Element) {
    item.forEach((e) => {
        const span = document.createElement('span') as HTMLSpanElement;
        span.textContent = e.text;
        span.style.color = e.color;
        span.style.textDecorationColor = e.color;
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

function strip(el: HTMLElement, target?: Element) {
    const textTree = parse(el);
    optimizeTree(textTree);
    while (el.lastChild !== null) {
        el.removeChild(el.lastChild);
    }
    randerFromTree(textTree, target || el);
    return textTree;
}

/*
[23:50:52] [main/INFO]: [CHAT] &l  bold
[23:50:52] [main/INFO]: [CHAT] &m  strikethrough
[23:50:52] [main/INFO]: [CHAT] &n  underline
[23:50:52] [main/INFO]: [CHAT] &o  ltalic
[23:50:52] [main/INFO]: [CHAT] &r  reset
*/

function toMinecraftString(item: StringItem[]) {
    let result = '';
    item.forEach((e, i) => {
        if (i <= 0
             || e.color !== item[i - 1].color
             || (!e.bold && item[i - 1].bold)
             || (!e.strikethrough && item[i - 1].strikethrough)
             || (!e.underline && item[i - 1].underline)
             || (!e.italic && item[i - 1].italic)) {
            const hexColor = rgb2hex(e.color).hex;
            if (defaultColor === hexColor) {
                result += '&r';
            } else {
                result += `&${hexColor}`;
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
        result += e.text;
    });
    return result;
}

parseBtn.addEventListener('click', () => {
    const selection = document.getSelection() as Selection;
    console.log(selection);
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const extracted = range.extractContents();
        console.log(extracted);
        // range.insertNode(extracted);
    }
});

const boldBtn = document.getElementById('bold') as HTMLButtonElement;
const italicBtn = document.getElementById('italic') as HTMLButtonElement;
const underlineBtn = document.getElementById('underline') as HTMLButtonElement;
const strikeBtn = document.getElementById('strike') as HTMLButtonElement;
const colorBtn = document.getElementById('color') as HTMLButtonElement;

boldBtn.addEventListener('click', () => {
    document.execCommand('bold', false);
});

italicBtn.addEventListener('click', () => {
    document.execCommand('italic', false);
});

underlineBtn.addEventListener('click', () => {
    document.execCommand('underline', false);
});

strikeBtn.addEventListener('click', () => {
    document.execCommand('strikeThrough', false);
});

colorBtn.addEventListener('click', () => {
    document.execCommand('foreColor', false, `${prompt('请输入颜色代码', '#000000')}`);
});

// eslint-disable-next-line no-undef
let stripTimer: NodeJS.Timer | null = null;

content.addEventListener('focus', () => {
    if (stripTimer !== null) {
        clearTimeout(stripTimer);
        stripTimer = null;
    }
});

content.addEventListener('blur', () => {
    if (stripTimer) {
        clearTimeout(stripTimer);
    }
    stripTimer = setTimeout(() => {
        const result = strip(content);
        const display = document.getElementById('results') as HTMLTextAreaElement;
        display.value = toMinecraftString(result);
    }, 1000);
});

function insertHTMLAtCaret(e: HTMLElement) {
    let range: Range;
    const sel = window.getSelection() as Selection;
    if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(e);
    }
}

function saveSelection() {
    const sel = window.getSelection() as Selection;
    if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
    }
    return null;
}

function restoreSelection(range: Range) {
    if (range) {
        const sel = window.getSelection() as Selection;
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

content.addEventListener('paste', (e) => {
    e.preventDefault();
    const data = e.clipboardData;
    if (data === null) {
        return;
    }
    const temp = document.createElement('div');
    temp.innerHTML = data.getData('text/html');
    temp.style.color = defaultColor;

    document.body.appendChild(temp);
    const tree = parse(temp, temp);
    document.body.removeChild(temp);

    const filtered = document.createElement('span');
    randerFromTree(tree, filtered);
    const selection = saveSelection();
    insertHTMLAtCaret(filtered);
    if (selection !== null) {
        restoreSelection(selection);
    }
});
