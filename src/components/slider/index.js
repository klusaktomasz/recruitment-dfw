import Navigation from './navigation';
import Pagination from './pagination';

class Slider {
  /**
   * Creates new slider.
   *
   * @param {HTMLElement|string} element
   */
  constructor(element) {
    // Validate passed slider element.
    if (typeof element === 'string') {
      this.$el = document.querySelector(element);
    }
    else if (element instanceof HTMLElement) {
      this.$el = element;
    }
    if (!this.$el) {
      throw new TypeError('element must be passed as non-empty string representing valid CSS selector or Element Object');
    }

    // Provide this to methods.
    this._manageResize = this._manageResize.bind(this);
    this.nextItems = this.nextItems.bind(this);
    this.prevItems = this.prevItems.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handlePagination = this.handlePagination.bind(this);

    // Slider's items.
    this.$items = this.$el.querySelector('.slider__items');

    this.itemsToShow = null;
    this._setItemsToShow();

    // Always start with first item.
    this._currentItemIndex = 0;
    this.showItem(0);

    this._createNavigation();
    this._createPagination();

    window.addEventListener('resize', this._manageResize);
  }

  /**
   * Sets current item index and manages slider.
   * @param currentItemIndex
   */
  set currentItemIndex (currentItemIndex) {
    this._currentItemIndex = currentItemIndex;
    this.showItem(currentItemIndex);
    this._setNavigationState();
    this.pagination.setActivePage(Math.ceil(currentItemIndex / this.itemsToShow));
  }

  /**
   * Returns current item index.
   * @returns {number}
   */
  get currentItemIndex () {
    return this._currentItemIndex;
  }

  /**
   * Recalculates position of slider.
   * @private
   */
  _manageResize() {
    this._setItemsToShow()
    this.showItem(this.currentItemIndex);

    this._createPagination();
  }

  /**
   * Creates navigation for slider.
   * @private
   */
  _createNavigation () {
    const prevBtn = this.$el.querySelector('.slider__control-btn--prev');
    const nextBtn = this.$el.querySelector('.slider__control-btn--next');
    if (prevBtn && nextBtn) {
      this.navigation = new Navigation(prevBtn, nextBtn, this.handleNavigation);
    }
  }

  /**
   * Callback for navigation buttons.
   *
   * @param {number} side - represents in which side should slider go. Must be -1 or 1.
   * @private
   */
  handleNavigation (side) {
    if (side === -1) {
      this.prevItems();
    }
    else {
      this.nextItems();
    }
  }

  /**
   * Creates pagination for slider..
   * @private
   */
  _createPagination () {
    const paginationEl = this.$el.querySelector('.slider__pagination');
    if (paginationEl) {
      this.pagination = new Pagination(
        paginationEl,
        this.$items.children.length,
        this.itemsToShow,
        this.handlePagination
      );

      this.pagination.setActivePage(Math.ceil(this.currentItemIndex / this.itemsToShow));
    }
  }

  /**
   * Callback for pagination click.
   * @param {number} pageIndex
   * @private
   */
  handlePagination (pageIndex) {
    let newFirstItemIndex = pageIndex * this.itemsToShow;
    if (newFirstItemIndex > this.$items.children.length - this.itemsToShow) {
      newFirstItemIndex = this.$items.children.length - this.itemsToShow;
    }
    this.currentItemIndex = newFirstItemIndex;
  }

  /**
   * Sets state of buttons depending on shown items.
   * @private
   */
  _setNavigationState () {
    if (!this.navigation) {
      return;
    }

    this.navigation.setStates(
      this.currentItemIndex === 0,
      this.currentItemIndex + this.itemsToShow >= this.$items.children.length
    );
  }

  /**
   * Counts item's amount that have to be seen at once.
   * @private
   */
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

  /**
   * Sets new item to show.
   *
   * @param {number} index - index of first item to show.
   */
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

  /**
   * Handles click on next button and set new items to show.
   */
  nextItems () {
    let newFirstItemIndex = this.currentItemIndex + this.itemsToShow;
    if (newFirstItemIndex > this.$items.children.length - this.itemsToShow) {
      newFirstItemIndex = this.$items.children.length - this.itemsToShow;
    }
    this.currentItemIndex = newFirstItemIndex;
  }

  /**
   * Handles click on prev button and set new items to show.
   */
  prevItems () {
    let newFirstItemIndex = this.currentItemIndex - this.itemsToShow;
    if (newFirstItemIndex < 0 ) {
      newFirstItemIndex = 0
    }
    this.currentItemIndex = newFirstItemIndex;
  }
}

export default Slider;
