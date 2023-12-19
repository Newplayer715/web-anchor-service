import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import user from "./modules/user";
import chatIM from "./modules/chatIM";
import chatWS from "./modules/chatWS";
import liveWS from "./modules/liveWS";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    chatIM,
    chatWS,
    liveWS,
  },
  getters,
});
export default store;
