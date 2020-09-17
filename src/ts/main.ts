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

function parse(el: HTMLElement) {
    let item: StringItem[] = [];
    el.childNodes.forEach((e) => {
        if (e.nodeType === Node.TEXT_NODE) {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const bold = Number(styles.fontWeight) >= 700;
            const italic = (styles.fontStyle === 'italic') || (styles.fontStyle === 'oblique');
            const underline = styles.textDecorationLine === 'underline';
            const strikethrough = styles.textDecorationLine === 'line-through';
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

parseBtn.addEventListener('click', () => {
    console.log(parse(content));
});
