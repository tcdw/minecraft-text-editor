class Bubble {
    private el: HTMLElement;

    constructor() {
        this.el = document.createElement('div');
        this.el.className = 'tip-box';
        this.el.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.el);
    }

    show(base: HTMLElement, text: string) {
        const bound = base.getBoundingClientRect();
        this.el.style.display = 'block';
        this.el.textContent = text;

        const bubbleBound = this.el.getBoundingClientRect();
        this.el.style.left = `${bound.x + (bound.width / 2) - (bubbleBound.width / 2)}px`;
        this.el.style.top = `${bound.y + bound.height + (0.4 * 16)}px`;
    }

    hide() {
        this.el.style.display = 'none';
    }
}

export default Bubble;
