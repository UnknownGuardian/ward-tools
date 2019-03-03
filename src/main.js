/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

Vue.config.productionTip = false;

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
Vue.use(VueMaterial);

import * as VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo);

import Vuex from "vuex";
Vue.use(Vuex);
Vue.use(require("vue-moment"));
Vue.use(require("vue-truncate-filter"));

Vue.filter("phone", function(phone) {
  return phone
    .replace(/[^0-9]/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
});

import App from "./App";

import router from "./router";

const store = require("@/store").default;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
