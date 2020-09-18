import rgb2hex from 'rgb2hex';

const content = document.getElementById('content') as HTMLDivElement;
const parseBtn = document.getElementById('parse') as HTMLButtonElement;

interface StringItem {
    text: string;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

function searchLineStyle(el: HTMLElement, root: HTMLElement, name: string): boolean {
    const styles = window.getComputedStyle(el);
    if (styles.textDecorationLine.includes(name)) {
        return true;
    }
    if (el.isEqualNode(root)) {
        return false;
    }
    return searchLineStyle(el.parentNode as HTMLElement, root, name);
}

function parse(el: HTMLElement) {
    let item: StringItem[] = [];
    el.childNodes.forEach((e) => {
        if (e.nodeType === Node.TEXT_NODE) {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const bold = Number(styles.fontWeight) >= 700;
            const italic = (styles.fontStyle === 'italic') || (styles.fontStyle === 'oblique');
            const parentStyles = window.getComputedStyle(el.parentNode as HTMLElement);
            const underline = searchLineStyle(el, content, 'underline');
            const strikethrough = searchLineStyle(el, content, 'line-through');
            item.push({
                text: e.nodeValue as string,
                color,
                bold,
                italic,
                underline,
                strikethrough,
            });
        } else if (e.nodeType === Node.ELEMENT_NODE) {
            item = item.concat(parse(e as HTMLElement));
        }
    });
    return item;
}

function strip(el: HTMLElement) {
    const textTree = parse(el);
    optimizeTree(textTree);
    while (el.childNodes.length > 0) {
        el.removeChild(el.lastChild as ChildNode);
    }
    textTree.forEach((e) => {
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
        el.appendChild(span);
    });
    return textTree;
}

function optimizeTree(item: StringItem[]) {
    let i = 0;
    while (i < item.length) {
        if (i <= 0) {
            i = 1;
            continue;
        }
        if (item[i].color === item[i - 1].color &&
            item[i].bold === item[i - 1].bold &&
            item[i].italic === item[i - 1].italic &&
            item[i].strikethrough === item[i - 1].strikethrough &&
            item[i].underline === item[i - 1].underline) {
            item[i - 1].text += item[i].text;
            item.splice(i, 1);
            continue;
        }
        i += 1;
    }
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
            result += `&${rgb2hex(e.color).hex}`;
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
    console.log(parse(content));
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

let stripTimer: NodeJS.Timer | null = null;

content.addEventListener('focus', () => {
    if (stripTimer !== null) {
        clearTimeout(stripTimer);
        stripTimer = null;
    }
})

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
