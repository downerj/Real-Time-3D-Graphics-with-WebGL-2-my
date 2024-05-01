/**
 * @typedef {(timestamp: DOMHighResTimeStamp) => void} AnimationCallback
 */

export class AnimationLoop {
  /**
   * @type {AnimationCallback}
   */ 
  #callback;
  /**
   * @type {number}
   */
  #interval;
  /**
   * @type {number?}
   */
  #handle = null;
  /**
   * @type {number}
   */
  #previous = 0;

  /**
   * @param {AnimationCallback} callback 
   * @param {number} interval 
   */
  constructor(callback, interval) {
    this.#callback = callback;
    this.#interval = interval;
  }

  resume() {
    if (this.#handle != null) {
      return;
    }
    this.#update();
  }

  suspend() {
    if (this.#handle == null) {
      return;
    }
    this.#cancel();
  }

  /**
   * @param {DOMHighResTimeStamp} timestamp 
   */
  #onTick(timestamp) {
    const elapsed = timestamp - this.#previous;
    if (elapsed >= this.#interval) {
      this.#previous = timestamp;
      this.#callback(timestamp);
    }
    this.#update();
  }

  #update() {
    this.#handle = requestAnimationFrame(this.#onTick.bind(this));
  }

  #cancel() {
    cancelAnimationFrame(this.#handle);
    this.#handle = null;
  }
}
