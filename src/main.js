import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/fonts/iconfont/iconfont.css";

import VueI18n from "vue-i18n";
import ms from "./locales/ms";
import en from "./locales/en";
import vi from "./locales/vi";
import zh_cn from "./locales/zh_cn";
import zh_hk from "./locales/zh_hk";

const TcPlayer = window.TcPlayer
Vue.prototype.TcPlayer = TcPlayer
import "element-ui/lib/theme-chalk/index.css";
import "./element-variables.scss";
import "./global.scss";
import ElementUI from "element-ui";
Vue.use(VueI18n);
Vue.use(ElementUI);

Vue.config.productionTip = false; // 在生产环境中禁用提示警告

const languageAbbreviation = localStorage.getItem("languageAbbreviation");
const i18n = new VueI18n({
  locale: languageAbbreviation, //默认
  messages: {
    en, // 英语
    ms, // 马来语
    vi, // 越南语
    zh_cn, // 简体中文
    zh_hk, // 繁体中文
  },
  // 隐藏警告
  silentTranslationWarn: true,
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  i18n,
}).$mount("#app");
