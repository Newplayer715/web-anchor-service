<template>
  <div class="contactList">
    <div
      v-for="(item, index) in messages"
      :key="index"
      class="contactItem"
      :class="{ active: currentChat?.target_id === item.contact.target_id }"
      @click="selectTarget(item)"
    >
      <div class="content">
        <div>
          <el-badge
            :hidden="item?.unread_message_count === 0 || type === 'live'"
            :value="item?.unread_message_count"
            :max="99"
            class="item"
          >
            <el-avatar :src="item.contact.avatar" :size="60"></el-avatar>
          </el-badge>
        </div>
        <div class="info">
          <div class="name">{{ item.contact.name }}</div>
          <div class="lastMessage">
            {{
              formatLastestMessageText(
                item.latest_message,
                item.contact.category
              )
            }}
          </div>
        </div>
      </div>
      <div class="time">{{ formatTime(item.latest_message?.send_at) }}</div>
    </div>
  </div>
</template>

<script>
import { formatTimeText } from '@/utils/tools';
import { mapActions, mapState } from 'vuex';
import { clearUnread, getLiveChatChannel } from '@/services/api/im';
export default {
  name: 'contactsList',
  props: {
    list: {
      type: Array,
      required: true,
    },
    type: {
      typeof: String,
      required: true,
    },
  },
  watch: {
    list: {
      handler(val) {
        this.messages = val;
      },
      deep: true,
    },
  },

  data() {
    return {
      messages: [],
    };
  },
  computed: {
    ...mapState({
      groupList: (state) => state.chatIM.groupList,
      customerList: (state) => state.chatIM.customerList,
      currentChat: (state) => state.chatIM.currentChat,
      liveContactList: (state) => state.chatIM.liveContactList,
      liveWSObj: (state) => state.liveWS.liveWSObj,
    }),
  },
  mounted() {
    this.messages = this.list;
    this.initEventLister();
  },
  methods: {
    ...mapActions('chatIM', [
      'setCurrentChat',
      'setGroupList',
      'setCustomerList',
    ]),
    ...mapActions('chatWS', ['handleChatMessge']),
    ...mapActions('liveWS', ['createLiveWS','removeAllHandleLiveMessge', 'disconnectLiveWS']),

    initEventLister() {
      if (this.type === 'live') {
        // const listenerList = ['live_chat_message_receive'];
        // // 监听广场ws消息
        // this.handleLiveMessge({
        //   type: listenerList,
        //   callback: (message) => {
        //     this.addRecentMessage(message);
        //   },
        //   id: `liveChat`,
        // });
        return;
      }
      const listenerList =
        this.type === 'private'
          ? ['chat_message_receive', 'friend_add', 'friend_recall']
          : [
              'chat_message_receive',
              'group_recall',
              'group_increase',
              'group_decrease',
              'group_upload',
              'group_ban',
            ];
      // 监听聊天ws消息
      this.handleChatMessge({
        type: listenerList,
        callback: (message) => {
          this.addRecentMessage(message);
        },
        id: `chatList-${this.type}`,
      });
    },
    /**
     * 添加一条最近消息
     * @param {object} message 最近消息
     */
    async addRecentMessage(result) {
      const { data: message } = result || {};
      const {
        contact,
        // total_unread_message_count,
      } = message || {};
      if (contact.category !== this.type) return;
      const tempArr = this.type === 'private' ? this.customerList : this.groupList;
      const  fn = this.type === 'private' ? this.setCustomerList : this.setGroupList;

      const targetIndex = tempArr.findIndex(
        (item) => item.contact.target_id === contact.target_id
      );
      if (targetIndex !== -1) {
        // 将原来的替换成message
        tempArr.splice(targetIndex, 1, message);
      } else {
        tempArr.unshift(message);
      }
      tempArr.sort((a, b) => {
        return b.latest_message?.send_at - a.latest_message?.send_at;
      });
      fn?.(tempArr);
      // 如果当前聊天窗口是该联系人，将未读消息清零
      if (
        this.currentChat?.target_id === contact.target_id) {
        await this.readMessage({
          category: contact.category,
          target_id: contact.target_id,
        });
      }
    },
    async readMessage({ category, target_id }) {
      const res = await clearUnread({
        category,
        target_id,
      });
      const { statusCode, data } = res || {};
      if (statusCode === 200) {
        let tempArr =
          this.type === 'private' ? this.customerList : this.groupList;
        const targetIndex = tempArr.findIndex(
          (item) => item.contact.target_id === target_id
        );
        if (targetIndex !== -1) {
          tempArr[targetIndex].unread_message_count = data.unread_message_count;
          const fn =
            this.type === 'private' ? this.setCustomerList : this.setGroupList;
          fn(tempArr);
        }
      } else {
        this.$message.error('服务端异常');
      }
    },
    async initLiveChannel(param) {
      try {
        const res = await getLiveChatChannel(param);
        const { data, statusCode } = res;
        if (statusCode === 200) {
          const {
            link,
            heartbeat_interval: heartbeatInterval,
            ack_nbits: ackNbits,
            heartbeat_tolerance: heartbeatTolerance,
            max_reconnect_times: maxReconnectTimes,
            ack_interval: ackInterval,
          } = data || {};
          this.createLiveWS({
            url: link,
            options: {
              heartbeatInterval,
              ackNbits,
              heartbeatTolerance,
              maxReconnectTimes,
              ackInterval,
            },
          });
        } else {
          this.$message.error('获取广场频道失败');
        }
      } catch (e) {
        console.log(e);
      }
    },
    async selectTarget(item) {
      const { contact } = item;
      this.setCurrentChat(contact);
      if (contact.category === 'live') {
        // 判断liveWSObj是否为空对象
        if (Object.keys(this.liveWSObj).length !== 0) {
          this.disconnectLiveWS();
          // 清空之前的handleLiveMessge
          this.removeAllHandleLiveMessge();
        }
        // 获取直播间的频道
        await this.initLiveChannel({ live_id: contact.target_id });
      } else {
        await this.readMessage({
          category: contact.category,
          target_id: contact.target_id,
        });
      }
    },
    // 根据消息格式显示消息内容
    formatLastestMessageText(lastestMessage, messageType) {
      let text = '';
      const { content, sender } = lastestMessage || {};
      if (messageType == 'group' && sender) {
        text += sender?.name + ': ';
      }
      content?.map((item) => {
        const { type, data } = item;
        switch (type) {
          case 'text':
            text += data?.text;
            break;
          case 'image':
            text += '[图片]';
            break;
          case 'face':
            text += '[动画表情]';
            break;
          case 'document':
            text += '[文件]';
            break;
          case 'friend_recall':
            text += data.user_name + '撤回了一条消息';
            break;
          case 'group_recall':
            text += data.user_name + '撤回了一条消息';
            break;
          case 'group_increase':
            text += data.user_name + '加入群聊';
            break;
          case 'group_decrease':
            text += data.user_name + '退出群聊';
            break;
          case 'group_ban':
            text +=
              data.user_name + data.sub_type === 'ban'
                ? '被禁言'
                : '被解除禁言';
            break;
          default:
            break;
        }
      });
      return text;
    },
    // 格式化时间
    formatTime(time) {
      return formatTimeText(time);
    },
  },
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
