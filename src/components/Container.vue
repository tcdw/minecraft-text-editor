<template>
    <div class="container">
        <header>
            <h1>Minecraft Text Editor</h1>
        </header>
        <section class="editor">
            <div class="editbox">
                <div class="toolbar">
                    <button class="icon-btn material-icons" v-on:click="bold">format_bold</button>
                    <button class="icon-btn material-icons" id="italic">format_italic</button>
                    <button class="icon-btn material-icons"
                        id="underline">format_underlined</button>
                    <button class="icon-btn material-icons" id="strike">strikethrough_s</button>
                </div>
                <div contenteditable="true"
                    id="content" class="monospace" ref="content">在这里输入你的文本……</div>
            </div>
        </section>
        <section class="edit-results">
            <div class="result-banner clearfix">
                <span class="left">生成的代码</span>
                <button class="right" id="copy-btn" data-clipboard-target="#results">复制代码</button>
            </div>
            <textarea id="results" style="font-family: monospace;"></textarea>
        </section>
        <Info />
    </div>
</template>

<script lang="js">
import TextEditor from '../editor';
import Info from './Info.vue';

export default {
    data() {
        return {
            textEditor: null,
        };
    },
    methods: {
        bold() {
            this.textEditor.setStyle('bold');
        },
    },
    mounted() {
        this.textEditor = new TextEditor(this.$refs.content);
        console.log(this.textEditor);
    },
    components: {
        Info,
    },
};
</script>

<style lang="scss" scoped>
.container {
    max-width: 50rem;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 1em;
    box-sizing: border-box;
    padding: 0 1em;
    box-shadow: rgba(0, 0, 0, 0.12) .25em .25em 1em .25em;
    & > header {
        text-align: center;
        padding: 1.2em 0;
        box-sizing: border-box;
        & > h1 {
            margin: 0;
            font-size: 1.7em;
        }
    }
    & > .info {
        padding: 1em 0;
    }
    @import "../scss/editor.scss";
}
</style>
