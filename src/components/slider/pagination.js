class Pagination {
  /**
   * Creates new pagination.
   *
   * @param {HTMLElement|string} element - element where pagination has to be generated.
   * @param {number} itemsAmount - amount of all items.
   * @param {number} itemsOnPage - amount of items on one page.
   * @param {function} callback - function that has to be called on changing page.
   */
  constructor (element, itemsAmount, itemsOnPage, callback) {
    // Validate passed pagination element.
    if (typeof element === 'string') {
      this.$el = document.querySelector(element);
    }
    else if (element instanceof HTMLElement) {
      this.$el = element;
    }
    if (!this.$el) {
      throw new TypeError('element must be passed as non-empty string representing valid CSS selector or Element Object');
    }

    this.generatePageDots = this.generatePageDots.bind(this);

    this.itemsAmount = itemsAmount;
    this.itemsOnPage = itemsOnPage;
    this.callback = callback;

    this.generatePageDots();
  }

  /**
   * Creates new pagination dots.
   */
  generatePageDots () {
    // Remove all children if there is any.
    while (this.$el.firstChild) {
      this.$el.removeChild(this.$el.firstChild);
    }

    // Create new pagination.
    const pagesAmount = Math.ceil(this.itemsAmount / this.itemsOnPage);
    for (let i = 0; i < pagesAmount; i++) {
      const pageDot = document.createElement('button');
      pageDot.classList.add('pagination__page');
      pageDot.addEventListener('click', () => this.callback.call(null, i));

      this.$el.appendChild(pageDot);
    }
  }

  /**
   * Sets active page.
   *
   * @param {number} index - index of page that has to be highlighted.
   */
  setActivePage (index) {
    const pageDots = [...this.$el.children];
    pageDots.forEach(el => {
      el.classList.remove('pagination__page--active');
    });

    pageDots[index].classList.add('pagination__page--active');
  }
}

export default Pagination;
