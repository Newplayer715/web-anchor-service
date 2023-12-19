const state = {
  currentChat: null,
  // 快捷信息 一定要及时清空
  quickMessage: null, 
  customerList: [],
  groupList: [],
  liveContactList: [],
};

const mutations = {
  SET_CURRENT_CHAT(state, chat) {
    state.currentChat = chat;
  },
  CLEAR_CURRENT_CHAT(state) {
    state.currentChat = null;
  },
  SET_CUSTOMER_LIST(state, list) {
    state.customerList = list;
  },
  SET_GROUP_LIST(state, list) {
    state.groupList = list;
  },
  SET_LIVE_CONTACT_LIST(state, list) {
    state.liveContactList = list;
  },
  SET_QUICK_MESSAGE(state, message){
    state.quickMessage = message;
  },
  CLEAR_QUICK_MESSAGE(state){
    state.quickMessage = null;
  }
};
const actions = {
  setCurrentChat({ commit }, chat) {
    // console.log('chat', chat);
    commit('SET_CURRENT_CHAT', chat);
  },
  clearCurrentChat({ commit }) {
    commit('CLEAR_CURRENT_CHAT');
  },
  setCustomerList({ commit }, list) {
    commit('SET_CUSTOMER_LIST', list);
  },
  setGroupList({ commit }, list) {
    commit('SET_GROUP_LIST', list);
  },
  setLiveContactList({ commit }, list) {
    commit('SET_LIVE_CONTACT_LIST', list);
  },
  //  更新最新的消息
  changeLatestMessage({ commit }, { latestMessage }) {
    const { category, target_id } = state.currentChat;
    let targetList = [];
    let type = '';
    if (category === 'private') {
      targetList = state.customerList;
      type = 'SET_CUSTOMER_LIST';
    } else if (category === 'group') {
      targetList = state.groupList;
      type = 'SET_GROUP_LIST';
    }else{
      targetList = state.liveContactList;
      type = 'SET_LIVE_CONTACT_LIST';
    }
    const targetIndex = targetList.findIndex(
      (item) => item.contact.target_id === target_id
    );
    if (targetIndex !== -1) {
      targetList[targetIndex].latest_message = latestMessage;
    }
    commit(type, targetList);
  },
  // 快捷消息：文本/文件/链接/图片
  setQuickMessage({commit}, message){
    commit('SET_QUICK_MESSAGE', message);
  },
  // 清空快捷消息
  clearQuickMessage({commit}){
    commit('CLEAR_QUICK_MESSAGE');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  
};
