// Gesture controller for 3D Jet navigation (wheel, touch, keys)
const WHEEL_THRESHOLD = 28;
const WHEEL_PE = 650;
const WHEEL_UG = 240;
const TOUCH_THRESHOLD = 42;
const WHEEL_GE = 900;

function isPageScrolled() {
  return window.scrollY > 1;
}

export class GestureController {
  el;
  onStep;
  isBusy;
  settledAt;
  atEnd;
  accum = 0;
  lastWheel = 0;
  lastAbs = 0;
  gestureConsumed = false;
  touchY = null;
  touchX = 0;
  touchFired = false;
  enabled = true;
  passedAt = -1e9;
  arriving = false;

  constructor(el, onStep, isBusy, settledAt = () => 0, atEnd = () => false) {
    this.el = el;
    this.onStep = onStep;
    this.isBusy = isBusy;
    this.settledAt = settledAt;
    this.atEnd = atEnd;

    el.addEventListener("wheel", this.wheel, { passive: false });
    el.addEventListener("touchstart", this.touchStart, { passive: true });
    el.addEventListener("touchmove", this.touchMove, { passive: false });
    el.addEventListener("touchend", this.touchEnd, { passive: true });
    window.addEventListener("keydown", this.key);
  }

  setEnabled(val) {
    this.enabled = val;
  }

  wheel = (e) => {
    const now = e.timeStamp || performance.now();
    const dt = now - this.lastWheel;
    this.lastWheel = now;
    const absY = Math.abs(e.deltaY);
    const prevAbs = this.lastAbs;
    this.lastAbs = absY;

    if (dt > WHEEL_UG && (dt < WHEEL_GE && absY <= prevAbs * 1.3 + 4 || (this.gestureConsumed = false, this.accum = 0))) {
      // reset gesture state
    }

    const settled = !this.isBusy() && now >= this.settledAt();

    if (isPageScrolled() || (this.atEnd() && e.deltaY > 0 && settled && !this.gestureConsumed)) {
      this.passedAt = now;
      if (isPageScrolled()) this.arriving = true;
      this.accum = 0;
      return;
    }

    e.preventDefault();

    if (now - this.passedAt < WHEEL_UG || (this.arriving && dt < WHEEL_PE)) {
      this.gestureConsumed = true;
      return;
    }

    this.arriving = false;
    if (!this.enabled || this.gestureConsumed) return;
    if (!settled) {
      this.gestureConsumed = true;
      return;
    }

    const mode = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? 400 : 1;
    const delta = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0) * mode;

    if (this.accum !== 0 && Math.sign(delta) !== Math.sign(this.accum)) {
      this.accum = 0;
    }

    this.accum += delta;

    if (Math.abs(this.accum) >= WHEEL_THRESHOLD) {
      const dir = this.accum > 0 ? 1 : -1;
      this.accum = 0;
      this.gestureConsumed = true;
      this.onStep(dir, "wheel");
    }
  };

  touchStart = (e) => {
    if (e.touches.length === 1) {
      this.touchY = e.touches[0].clientY;
      this.touchX = e.touches[0].clientX;
      this.touchFired = false;
    }
  };

  touchMove = (e) => {
    if (this.touchY === null) return;
    const dy = this.touchY - e.touches[0].clientY;
    const dx = this.touchX - e.touches[0].clientX;

    if (isPageScrolled() || (this.atEnd() && dy > 0 && !this.isBusy())) return;

    if (Math.abs(dy) > Math.abs(dx)) {
      e.preventDefault();
    }

    if (this.touchFired || !this.enabled || this.isBusy()) return;

    const now = e.timeStamp || performance.now();
    if (now < this.settledAt()) return;

    if (Math.abs(dy) > TOUCH_THRESHOLD && Math.abs(dy) > Math.abs(dx) * 1.2) {
      this.touchFired = true;
      this.onStep(dy > 0 ? 1 : -1, "touch");
    }
  };

  touchEnd = () => {
    this.touchY = null;
  };

  key = (e) => {
    const target = e.target;
    if (
      (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) ||
      isPageScrolled() ||
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      (target && target !== document.body && !this.el.contains(target))
    ) {
      return;
    }

    let dir = 0;
    if (["ArrowDown", "PageDown", "ArrowRight"].includes(e.key) || (e.key === " " && !e.shiftKey)) {
      dir = 1;
    }
    if (["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key) || (e.key === " " && e.shiftKey)) {
      dir = -1;
    }

    if (dir) {
      if (dir === 1 && this.atEnd() && !this.isBusy()) return;
      if (e.key === " " && target?.tagName === "BUTTON") return;

      e.preventDefault();
      if (e.repeat || !this.enabled || this.isBusy()) return;

      const now = e.timeStamp || performance.now();
      if (now < this.settledAt()) return;

      this.onStep(dir, "key");
    }
  };

  dispose() {
    this.el.removeEventListener("wheel", this.wheel);
    this.el.removeEventListener("touchstart", this.touchStart);
    this.el.removeEventListener("touchmove", this.touchMove);
    this.el.removeEventListener("touchend", this.touchEnd);
    window.removeEventListener("keydown", this.key);
  }
}
