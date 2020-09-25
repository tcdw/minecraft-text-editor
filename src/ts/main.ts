// TODO: 进行处理

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */

import Clipboard from 'clipboard';
import Bubble from './bubble';
import { TextEditor } from './editor';
import 'normalize.css/normalize.css';
import 'github-markdown-css/github-markdown.css';
import '../scss/main.scss';

const modalCloser = document.getElementById('modal-closer') as HTMLDivElement;
const content = document.getElementById('content') as HTMLDivElement;
const boldBtn = document.getElementById('bold') as HTMLButtonElement;
const italicBtn = document.getElementById('italic') as HTMLButtonElement;
const underlineBtn = document.getElementById('underline') as HTMLButtonElement;
const strikeBtn = document.getElementById('strike') as HTMLButtonElement;
const colorBtn = document.getElementById('color') as HTMLButtonElement;
const colorPanel = document.getElementById('color-panel') as HTMLDivElement;
const customColor = document.getElementById('custom-color') as HTMLInputElement;
const currentColor = document.getElementById('current-color') as HTMLDivElement;
const results = document.getElementById('results') as HTMLInputElement;

const textEditor = new TextEditor(content);
const bubble = new Bubble();

textEditor.strip();

let userSelection: Range | null = null;

function closeColorBox() {
    colorBtn.classList.remove('focus');
    colorPanel.style.display = 'none';
    modalCloser.style.display = 'none';
    userSelection = null;
}
function openColorBox() {
    colorBtn.classList.add('focus');
    colorPanel.style.display = 'block';
    modalCloser.style.display = 'block';
    userSelection = TextEditor.saveSelection();
    modalCloser.addEventListener('click', closeColorBox);
}

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
    openColorBox();
});

function setBuiltinColorEvent(e: MouseEvent) {
    const src = e.target as HTMLElement;
    const code = Number(src.dataset.color);
    textEditor.setColor(`#${TextEditor.builtinColor[code]}`);
    closeColorBox();
}

const colorBtns = document.getElementsByClassName('color-btn');
Array.prototype.forEach.call(colorBtns, (e: HTMLElement) => {
    e.addEventListener('click', setBuiltinColorEvent);
});

customColor.addEventListener('change', () => {
    TextEditor.restoreSelection(userSelection);
    const { value } = customColor;
    textEditor.setColor(customColor.value);
    currentColor.style.backgroundColor = customColor.value;

    // 自定义颜色展示区是不是太浅了？如果是，增加外框
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);
    currentColor.style.border = '0';
    if (r > 0xde && g > 0xde && b > 0xde) {
        currentColor.style.border = '1px solid #dedede';
    }
    closeColorBox();
});

document.addEventListener('selectionchange', () => {
    if (userSelection) {
        return;
    }
    if (!textEditor.isSelectedInBox()) {
        textEditor.strip();
        results.value = textEditor.toMinecraftString();
    }
});

// eslint-disable-next-line no-undef
let stripTimer: NodeJS.Timer | null = null;

content.addEventListener('focus', () => {
    if (stripTimer !== null) {
        clearTimeout(stripTimer);
        stripTimer = null;
    }
});

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

const bgBtn = document.getElementById('background') as HTMLButtonElement;
const bgPanel = document.getElementById('bg-panel') as HTMLDivElement;

function closeBackgroundBox() {
    bgBtn.classList.remove('focus');
    bgPanel.style.display = 'none';
    modalCloser.style.display = 'none';
}

function openBackgroundBox() {
    bgBtn.classList.add('focus');
    bgPanel.style.display = 'block';
    modalCloser.style.display = 'block';
    modalCloser.addEventListener('click', closeBackgroundBox);
}

function setBackgroundEvent(e: MouseEvent) {
    const el = e.target as HTMLAnchorElement;
    textEditor.defaultColor = `${el.dataset.fg}`;
    textEditor.content.style.backgroundColor = `${el.dataset.bg}`;
    results.value = textEditor.toMinecraftString();
    closeBackgroundBox();
}

bgBtn.addEventListener('click', openBackgroundBox);

const bgList = bgPanel.querySelectorAll('li');
bgList.forEach((e) => {
    const anchor = e.querySelector('a') as HTMLAnchorElement;
    anchor.addEventListener('click', setBackgroundEvent);

    // 圈圈颜色的设置
    const bg = `${anchor.dataset.bg}`;
    const bgDisplay = document.createElement('div');
    bgDisplay.className = 'bg-display';
    bgDisplay.setAttribute('aria-hidden', 'true');
    bgDisplay.style.backgroundColor = bg;
    if (bg === '#fff') {
        bgDisplay.style.border = '1px solid #dedede';
    }
    e.appendChild(bgDisplay);
});

// 结果展示区
const clipboard = new Clipboard('#copy-btn');
const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
clipboard.on('success', () => {
    bubble.show(copyBtn, '复制成功！');
});

copyBtn.addEventListener('mouseleave', () => {
    bubble.hide();
});
