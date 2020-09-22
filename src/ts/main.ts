// TODO: 进行处理

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */

import { TextEditor } from './editor';
import 'normalize.css/normalize.css';
import '@sukka/markdown.css/dist/markdown.css';
import '../scss/main.scss';

const modalCloser = document.getElementById('modal-closer') as HTMLDivElement;
const content = document.getElementById('content') as HTMLDivElement;
const parseBtn = document.getElementById('parse') as HTMLButtonElement;
const boldBtn = document.getElementById('bold') as HTMLButtonElement;
const italicBtn = document.getElementById('italic') as HTMLButtonElement;
const underlineBtn = document.getElementById('underline') as HTMLButtonElement;
const strikeBtn = document.getElementById('strike') as HTMLButtonElement;
const insertBtn = document.getElementById('insert') as HTMLButtonElement;
const colorBtn = document.getElementById('color') as HTMLButtonElement;
const colorPanel = document.getElementById('color-panel') as HTMLDivElement;

const textEditor = new TextEditor(content);

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

boldBtn.addEventListener('click', () => {
    textEditor.setStyle('bold');
});

italicBtn.addEventListener('click', () => {
    textEditor.setStyle('italic');
});

underlineBtn.addEventListener('click', () => {
    textEditor.setStyle('underline');
});

strikeBtn.addEventListener('click', () => {
    textEditor.setStyle('strikethrough');
});

colorBtn.addEventListener('click', () => {
    colorBtn.classList.add('focus');
    colorPanel.style.display = 'block';
    modalCloser.style.display = 'block';
});

modalCloser.addEventListener('click', () => {
    colorBtn.classList.remove('focus');
    colorPanel.style.display = 'none';
    modalCloser.style.display = 'none';
});

function setBuiltinColorEvent(e: MouseEvent) {
    const src = e.target as HTMLElement;
    const code = Number(src.dataset.color);
    document.execCommand('foreColor', false, `#${TextEditor.builtinColor[code]}`);
    colorPanel.style.display = 'none';
    modalCloser.style.display = 'none';
}

const colorBtns = document.getElementsByClassName('color-btn');
Array.prototype.forEach.call(colorBtns, (e: HTMLElement) => {
    e.addEventListener('click', setBuiltinColorEvent);
});

insertBtn.addEventListener('click', () => {
    const temp = document.createElement('span');
    temp.innerHTML = '<span style="color: #66ccff">测试内容</span>';
    temp.style.color = textEditor.defaultColor;

    // 在真实插入元素到文档以后，才可以获取计算以后的样式
    document.body.appendChild(temp);
    const tree = textEditor.parse(temp, temp);
    document.body.removeChild(temp);

    const target = document.createElement('span');
    TextEditor.randerFromTree(tree, target);
    TextEditor.insertContent(target);
});

// eslint-disable-next-line no-undef
let stripTimer: NodeJS.Timer | null = null;

content.addEventListener('focus', () => {
    if (stripTimer !== null) {
        clearTimeout(stripTimer);
        stripTimer = null;
    }
});

// content.addEventListener('blur', () => {
//     if (stripTimer) {
//         clearTimeout(stripTimer);
//     }
//     stripTimer = setTimeout(() => {
//         const result = textEditor.strip(content);
//         const display = document.getElementById('results') as HTMLTextAreaElement;
//         display.value = textEditor.toMinecraftString(result);
//     }, 1000);
// });

content.addEventListener('paste', (e) => {
    e.preventDefault();
    const data = e.clipboardData;
    if (data === null) {
        return;
    }

    if (data.getData('text/html').length <= 0 && data.getData('text/plain').length > 0) {
        // 用户使用了 Chrome 浏览器的「粘贴纯文本」功能
        let text = data.getData('text/plain');
        text = text.replace(/\r\n/g, ' ');
        text = text.replace(/\n/g, ' ');
        text = text.replace(/\r/g, ' ');
        TextEditor.insertContent(text);
    } else if (data.getData('text/html').length > 0) {
        // 用户正常粘贴
        const temp = document.createElement('span');
        temp.innerHTML = data.getData('text/html');
        temp.style.color = textEditor.defaultColor;

        // 在真实插入元素到文档以后，才可以获取计算以后的样式
        document.body.appendChild(temp);
        const tree = textEditor.parse(temp, temp);
        document.body.removeChild(temp);

        TextEditor.insertContent(tree);
    }
});

content.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        e.preventDefault();
    }
});
