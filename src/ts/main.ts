const content = document.getElementById('content') as HTMLDivElement;
const parseBtn = document.getElementById('parse') as HTMLButtonElement;
const stripBtn = document.getElementById('strip') as HTMLButtonElement;

interface StringItem {
    text: string;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
}

function parse(el: HTMLElement) {
    let item: StringItem[] = [];
    el.childNodes.forEach((e) => {
        if (e.nodeType === Node.TEXT_NODE) {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const bold = Number(styles.fontWeight) >= 700;
            const italic = (styles.fontStyle === 'italic') || (styles.fontStyle === 'oblique');
            const underline = styles.textDecorationLine.includes('underline');
            const strikethrough = styles.textDecorationLine.includes('line-through');
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
            item = item.splice(i, 1);
            continue;
        }
        i += 1;
    }
}

parseBtn.addEventListener('click', () => {
    console.log(parse(content));
});

stripBtn.addEventListener('click', () => {
    strip(content);
});

content.addEventListener('blur', () => {
    strip(content);
});