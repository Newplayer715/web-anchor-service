/* eslint-disable */
import { useSocket } from '@/utils/websocket';
const state = {
  liveWSObj: {},
  callbackObj: {},
};
const mutations = {
  SOCKET_ONOPEN(state, obj) {
    state.liveWSObj = obj;
  },
  SOCKET_ONCLOSE(state) {
    state.liveWSObj = {};
  },
  SOCKET_ONMESSAGECALLBACK(state, { type, callback, id }) {
    if (Array.isArray(type)) {
      type.map((item) => {
        state.callbackObj[item] = {
          ...state.callbackObj[item],
          [id]: callback,
        };
      });
    } else {
      state.callbackObj[type] = {
        ...state.callbackObj[type],
        [id]: callback,
      };
    }
  },
};
const actions = {
  // 创建实时通讯websocket
  createLiveWS({ commit }, { url, options = {} }) {
    const wsObj = useSocket({ url }, { ...options });
    commit('SOCKET_ONOPEN', wsObj);
  },
  // 断开实时通讯websocket
  disconnectLiveWS({ commit }) {
    state.liveWSObj.closeSocket();
    commit('SOCKET_ONCLOSE');
  },
  // 发送实时通讯消息
  sendLiveMessage(context, message) {
    if (state.liveWSObj.readyState !== 1) {
      // 延迟发送
      setTimeout(() => {
        context.dispatch('sendLiveMessage', message);
      }, 500);
    } else {
      state.liveWSObj.sendMessage(message);
    }
  },
  // 接收实时通讯消息
  handleLiveMessge({ commit }, { type, callback, id }) {
    // 允许多个type绑定同一个callback
    // 单个type时，入参type为string，多个type时，入参type为array
    commit('SOCKET_ONMESSAGECALLBACK', { type, callback, id });
    if (state.liveWSObj.readyState === 1) {
      state.liveWSObj.subscribe?.('message', (result) => {
        try {
          const { type } = result;
          if (state.callbackObj?.[type]) {
            Object.keys(state.callbackObj[type]).map((key) => {
              state.callbackObj[type][key](result);
            });
          }
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      setTimeout(() => {
        state.liveWSObj.subscribe?.('message', (result) => {
          try {
            const { type } = result;
            if (state.callbackObj?.[type]) {
              Object.keys(state.callbackObj[type]).map((key) => {
                state.callbackObj[type][key](result);
              });
            }
          } catch (error) {
            console.log(error);
          }
        });
      }, 500);
    }
  },
  // 移除处理实时通讯消息事件
  removeHandleLiveMessge({ commit }, { type, id }) {
    // 允许多个type解绑同一个callback
    // 单个type时，入参type为string，多个type时，入参type为array
    const obj = { ...state.callbackObj };
    if (Array.isArray(type)) {
      type.map((item) => {
        if (obj?.[item]) {
          delete obj[item][id];
        }
      });
    } else {
      if (obj?.[type]) {
        delete obj[type][id];
      }
    }
    state.callbackObj = obj;
  },
  // 移除所有处理实时通讯消息事件
  removeAllHandleLiveMessge({ commit }) {
    state.callbackObj = {};
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
