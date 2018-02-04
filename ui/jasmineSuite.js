import es6promise from 'es6-promise';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import stubVueRouter from './support/stubVueRouter';
import fillIn from './support/fillIn';
import stubDateMixin from './support/stubDateMixin';
import stubTween from './support/stubTween';
import stubI18n from './support/stubI18n';
import Vue from 'vue';
import Vuex from 'vuex';
import includes from 'array-includes';

/* eslint-disable no-extend-native */
Array.prototype.includes = includes;

es6promise.polyfill();
chai.use(sinonChai);
global.expect = expect;

stubVueRouter();
stubTween();

before(function () {
  Object.assign(this, stubDateMixin);
  this.stubDate();

  Vue.use(Vuex);

  this.i18n = stubI18n();
  this.fillIn = fillIn.bind(this);
});

after(function () {
  this.restoreStubDate();
});

const testsContext = require.context('.', true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
