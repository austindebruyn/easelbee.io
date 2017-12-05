import sinon from 'sinon';
import Vue from 'vue';

const TWEEN_SPY = sinon.spy();

before(function () {
  this.tweenSpy = TWEEN_SPY;
});

afterEach(function () {
  TWEEN_SPY.reset();
});

export default function () {
  Vue.use({
    install: function (Vue) {
      Vue.prototype.$tween = TWEEN_SPY;
    }
  });
};
