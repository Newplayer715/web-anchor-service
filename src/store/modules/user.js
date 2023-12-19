import { login } from "@/services/api/user";
import { getToken, setToken, removeToken } from "@/utils/authCookie";
import { Message } from "element-ui";
const TOKEN_KEY = "client_token";

const getDefaultState = () => {
  return {
    token: getToken(TOKEN_KEY),
    userInfo: "",
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },

  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFOR: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const getters = {
  getUserInfo: (state) => state.userInfo,
};

const actions = {
  // 登陆业务
  async login({ commit }, userInfo) {
    // console.log(userInfo);
    const { username, password } = userInfo;
    const res = await login({ username: username, password: password });
    const { data, statusCode } = res;
    // console.log(res);
    if (statusCode === 200) {
      const { token, user } = data;
      Message({
        message: "登陆成功，正在跳转",
        type: "success",
      });
      commit("SET_TOKEN", token.access);
      commit("SET_USERINFOR", user);
      setToken(TOKEN_KEY, token.access);
      localStorage.setItem("user_id", user.user_id);
    } else {
      // 接口发生错误
      Message({
        message: "网络错误",
        type: "error",
      });
    }
  },

  // 获取个人信息
  // async getInfo({ commit }) {
  // const country_id = localStorage.getItem('country_id');
  // const language_id = localStorage.getItem('language_id');
  // await getUser({
  //   country_id,
  //   language_id,
  // })
  //   .then((response) => {
  //     const data = response.data;
  //     const { time_zone } = data;
  //     commit('SET_USERINFOR', data);
  //     commit('SET_TIME', time_zone.utc_offset);
  //     // resolve(data)
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // },

  // 退出
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken(TOKEN_KEY); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(TOKEN_KEY); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
