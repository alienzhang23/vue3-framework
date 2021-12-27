import Vue from 'vue';

const bus = new Vue({});
bus._$on = bus.$on;
bus.$on = function (event, fn) {
  if (this._events[event]) {
    this.$off(event);
  }
  this._$on(event, fn);
};
export default bus;
