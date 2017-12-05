import TWEEN from '@tweenjs/tween.js';

let running = false;

var animate = function () {
  running = TWEEN.update();
  if (running) {
    return requestAnimationFrame(animate);
  }
};

const VueTween = {
  install(Vue) {
    return Vue.prototype.$tween = function (obj, duration) {
      if (this.tween) {
        this.tween.stop();
      }

      this.tween = new TWEEN.Tween(this)
        .to(obj, duration)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

      if (!running) {
        return animate();
      }
    };
  }
};

export default VueTween;
