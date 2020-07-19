class Slider {
  constructor(element) {
    // Validate passed slider element.
    if (typeof element === 'string') {
      this.$el = document.querySelector(element);
    }
    else if (element instanceof Element) {
      this.$el = element;
    }
    if (!this.$el) {
      throw new TypeError('element must be passed as non-empty string representing valid CSS selector or Element Object');
    }

    // Bind this to all functions
    this.nextItems = this.nextItems.bind(this);
    this.prevItems = this.prevItems.bind(this);
    this.showItem = this.showItem.bind(this);

    //
    this.$items = this.$el.querySelector('.slider__items');

    // Check if there are nav buttons, register all required events for them.
    this.$prevBtn = this.$el.querySelector('.slider__control-btn--prev');
    this.$nextBtn = this.$el.querySelector('.slider__control-btn--next');
    if (this.$prevBtn && this.$nextBtn) {
      this._registerNavButtons();
    }

    //
    this.itemsToShow = null;
    this._setItemsToShow();

    //
    this._currentItemIndex = 0;
  }

  set currentItemIndex (currentItemIndex) {
    this._currentItemIndex = currentItemIndex;
    this.showItem(currentItemIndex);
    this._manageBtns();
  }

  get currentItemIndex () {
    return this._currentItemIndex;
  }

  _registerNavButtons () {
    this.$nextBtn.addEventListener('click', this.nextItems);
    this.$prevBtn.addEventListener('click', this.prevItems);
  }

  _manageBtns () {
    if (!this.$prevBtn || !this.$nextBtn) {
      return;
    }

    this.$prevBtn.disabled = this.currentItemIndex === 0;
    this.$nextBtn.disabled = this.currentItemIndex + this.itemsToShow >= this.$items.children.length;
  }

  _setItemsToShow () {
    if (window.innerWidth <= 770) {
      this.itemsToShow = 1;
    }
    else if (window.innerWidth <= 1280) {
      this.itemsToShow = 2;
    }
    else {
      this.itemsToShow = 3;
    }
  }

  showItem (index) {
    const item = this.$items.children[index];
    if (!item) {
      throw new Error(`There is no item in slider with ${index} index`);
    }

    // Set position of slider.
    const {left: listOffsetLeft} = this.$items.getBoundingClientRect();
    const {left: itemOffsetLeft} = item.getBoundingClientRect();

    this.$items.style.transform = `translateX(-${itemOffsetLeft - listOffsetLeft}px)`;

    // Set visibility of items (prevent box-shadow of hidden elements).
    [...this.$items.children].forEach((item, itemIndex) => {
      item.style.opacity = (itemIndex >= index && itemIndex < index + this.itemsToShow)  ? '1' : '0';
    });
  }

  nextItems () {
    let newFirstItemIndex = this.currentItemIndex + this.itemsToShow;
    if (newFirstItemIndex > this.$items.children.length - this.itemsToShow) {
      newFirstItemIndex = this.$items.children.length - this.itemsToShow;
    }
    this.currentItemIndex = newFirstItemIndex;
  }

  prevItems () {
    let newFirstItemIndex = this.currentItemIndex - this.itemsToShow;
    if (newFirstItemIndex < 0 ) {
      newFirstItemIndex = 0
    }
    this.currentItemIndex = newFirstItemIndex;
  }
}

export default Slider;
