<template>
    <div class="all">
        <Container />
        <div class="modal-mask"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Container from './components/Container.vue';

@Options({
    components: {
        Container,
    },
})
export default class App extends Vue {}
</script>

<style lang="scss">
:root {
    --theme: #66ccff;
    font-size: 18px;
}
@media (max-width: 1600px) {
    :root {
        font-size: 16px;
    }
}
@media (max-width: 320px) {
    :root {
        font-size: 14px;
    }
}

body {
    margin: 1rem;
    font-size: 1rem;
    background-color: #66ccff;
    background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 268 268' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='37' cy='37' r='36'/%3E%3Ccircle cx='171' cy='171' r='36'/%3E%3C/g%3E%3C/svg%3E");
    background-attachment: fixed;
    font-family:
        Inter,
        -apple-system,
        'PingFang SC',
        'Microsoft Yahei',
        'WenQuanYi Micro Hei',
        sans-serif;
}

code, pre, .monospace {
    font-family: Consolas, "Ubuntu Mono", Monaco, "Courier New", Courier,
        'PingFang SC', 'Microsoft Yahei', 'WenQuanYi Micro Hei', monospace
}

input, button, textarea {
    font-size: 1rem;
}

.clearfix:after, .clearfix:before {
    content: " ";
    display: table
}

.clearfix:after {
    clear: both
}

.clearfix {
    zoom: 1
}

.modal-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
}
</style>
