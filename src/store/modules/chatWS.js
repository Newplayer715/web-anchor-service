/* eslint-disable */
import { useSocket } from '@/utils/websocket';
const state = {
  chatWSObj: {},
  callbackObj: {},
};
const mutations = {
  SOCKET_ONOPEN(state, obj) {
    state.chatWSObj = obj;
  },
  SOCKET_ONCLOSE(state) {
    state.chatWSObj = {};
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
  createChatWS({ commit }, { url, options }) {
    const wsObj = useSocket({ url }, { ...options });
    commit('SOCKET_ONOPEN', wsObj);
  },
  // 断开实时通讯websocket
  disconnectChatWS({ commit }) {
    state.chatWSObj.closeSocket();
    commit('SOCKET_ONCLOSE');
  },
  // 发送实时通讯消息
  sendChatMessage(context, message) {
    if (state.chatWSObj.readyState !== 1) {
      // 延迟发送
      setTimeout(() => {
        context.dispatch('sendChatMessage', message);
      }, 500);
    } else {
      state.chatWSObj.sendMessage(message);
    }
  },
  // 接收实时通讯消息
  handleChatMessge({ commit }, { type, callback, id }) {
    // 允许多个type绑定同一个callback
    // 单个type时，入参type为string，多个type时，入参type为array
    commit('SOCKET_ONMESSAGECALLBACK', { type, callback, id });
    // 判断chatWSObj是否存在，存在则绑定事件
    if (state.chatWSObj.readyState === 1) {
      state.chatWSObj.subscribe?.('message', (result) => {
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
      // 延迟发送
      setTimeout(() => {
        state.chatWSObj.subscribe?.('message', (result) => {
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
  removeHandleChatMessge({ commit }, { type, id }) {
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
