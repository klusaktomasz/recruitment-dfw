class Slider {
  constructor(element) {
    if (typeof element === 'string') {
      this.$el = document.querySelector(element);
    }
    else if (element instanceof Element) {
      this.$el = element;
    }

    if (!this.$el) {
      throw new TypeError('element must be passed as non-empty string representing valid CSS selector or Element Object');
    }

  }
}

export default Slider;
