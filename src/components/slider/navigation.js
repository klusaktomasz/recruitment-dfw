class Navigation {
  /**
   * Creates new navigation for slider.
   *
   * @param {HTMLElement} prevBtn
   * @param {HTMLElement} nextBtn
   * @param {function} callback
   */
  constructor (prevBtn, nextBtn, callback) {
    this.$prevBtn = prevBtn;
    this.$nextBtn = nextBtn;
    this.callback = callback;

    this._registerEvents();
  }

  /**
   * Register click events.
   * @private
   */
  _registerEvents () {
    this.$prevBtn.addEventListener('click', () => this.callback.call(null, -1));
    this.$nextBtn.addEventListener('click', () => this.callback.call(null, 1));
  }

  /**
   * Set state of buttons.
   *
   * @param {boolean} prevBtnState
   * @param {boolean} nextBtnState
   */
  setStates (prevBtnState, nextBtnState) {
    this.$prevBtn.disabled = prevBtnState;
    this.$nextBtn.disabled = nextBtnState;
  }
}

export default Navigation;
