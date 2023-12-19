<template>
  <div class="messageArea">
    <div class="messageList">
      <div class="content" v-if="messages?.length > 0">
        <div
          v-for="(item, index) in messages"
          :key="item.message_id"
          class="messageItem"
        >
          <div class="time">
            {{ formatTime(item?.send_at, index) }}
          </div>
          <div v-if="item.content_type === 'notice'" class="notice">
            <NoticeMessage :message="item?.content[0]" />
          </div>
          <div
            v-else
            class="messageContent"
            :class="
              item.sender.username === userInfo?.username ? 'sent' : 'received'
            "
          >
            <!-- 头像 -->
            <div
              class="avatar"
              :class="
                item.sender.username === userInfo?.username
                  ? 'avatar-right'
                  : 'avatar-left'
              "
            >
              <el-avatar :src="item.sender.avatar" :size="50"></el-avatar>
            </div>
            <!-- 对话框  对方-->
            <div
              v-if="item.sender.username !== userInfo?.username"
              class="message-content-left"
            >
              <div class="nameArea">
                <div class="name">{{ item.sender.name }}</div>
                <div class="time">{{ formatTime(item.send_at, 0) }}</div>
              </div>
              <div class="dialog">
                <div
                  class="text-content"
                  :style="{
                    background:
                      item.content?.[0].type === 'text' ||
                      item.content?.[0].type === 'face'
                        ? '#f0f0f0'
                        : '',
                    color: '#1f2329',
                  }"
                >
                  <MessageContent :content="item.content" />
                </div>
              </div>
            </div>
            <!-- 对话框  我-->
            <div v-else class="message-content-right">
              <div class="nameArea nameAreaRight">
                <div class="time">{{ formatTime(item.send_at, 0) }}</div>
                <div class="name">{{ item.sender.name }}</div>
              </div>
              <div class="dialogI">
                <div v-if="item.send_error" class="message-error">
                  <i class="el-icon-warning"></i>
                </div>
                <div
                  class="text-content"
                  :style="{
                    background:
                      item.content?.[0].type === 'text' ||
                      item.content?.[0].type === 'face'
                        ? '#5f49c6'
                        : '',
                  }"
                >
                  <messageContent :content="item.content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="scrollAnchor"></div>
    </div>
    <div class="inputArea">
      <div class="tools">
        <div class="tool">
          <!-- <div class="toolItem">
            <i class="el-icon-paperclip icon"></i>
          </div> -->
          <el-tooltip content="表情" placement="top" effect="light">
            <div class="toolItem">
              <el-popover placement="top" width="200" trigger="click">
                <EmojiCom @emotion="MEmotion" />
                <div
                  slot="reference"
                  class="iconfont icon-simle_line icon"
                ></div>
              </el-popover>
            </div>
          </el-tooltip>

          <!-- 
          <el-upload
            :action="fileUrl"
            :before-upload="beforeRead"
            :on-success="afterRead"
            :auto-upload="true"
            :show-file-list="false"
            :headers="{ Authorization: 'Bearer ' + token }"
          >
            <div class="toolItem">
              <i class="el-icon-picture icon"></i>
            </div>
          </el-upload> -->
        </div>
        <div class="tool">
          <el-tooltip content="聊天记录" placement="top" effect="light">
            <div class="toolItem" @click="historyMeassageVisible = true">
              <i class="el-icon-time icon"></i>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="inputContentArea">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6 }"
          placeholder="请输入内容"
          v-model="newMessage"
          @keyup.enter.native="handleEnter"
          id="send_M"
          class="nonBorderTextArea"
        >
        </el-input>
      </div>
      <div class="sendArea">
        <div class="tipText">Enter发送，ctrl+enter换行</div>
        <el-button
          type="primary"
          @click="
            sendMessageContent(newMessage, () => {
              newMessage = '';
            })
          "
          :disabled="!newMessage"
        >
          发送
        </el-button>
      </div>
    </div>

    <el-dialog title="搜索聊天记录" :visible.sync="historyMeassageVisible">
      <div class="searchDialogBody">
        <el-tabs v-model="activeType" @tab-click="handleClick">
          <el-tab-pane label="消息" name="text">
            <div class="messageSearchResult" v-if="textResult.length">
              <SearchTextMessages :list="textResult"></SearchTextMessages>
            </div>
            <div class="noData" v-else>
              <el-empty description="暂无数据"></el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="图片" name="image">
            <div class="messageSearchResult" v-if="imageResult.length"></div>
            <div class="noData" v-else>
              <el-empty description="暂无数据"></el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="链接" name="link">
            <div class="messageSearchResult" v-if="linkResult.length"></div>
            <div class="noData" v-else>
              <el-empty description="暂无数据"></el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="文件" name="file">
            <div class="messageSearchResult" v-if="fileResult.length"></div>
            <div class="noData" v-else>
              <el-empty description="暂无数据"></el-empty>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="dateSelect">
          <el-date-picker
            size="small"
            v-model="dateValue"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          >
          </el-date-picker>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  getHistoryMessage,
  getLiveChatHistoryMessage,
  sendLiveChatMessage,
  sendMessage,
} from '@/services/api/im';
import { formatTimeText } from '@/utils/tools';
import NoticeMessage from '@/components/NoticeMessage/Index.vue';
import MessageContent from '@/components/MessageContent/Index.vue';
import dayjs from 'dayjs';
// import Compressor from 'compressorjs';
import EmojiCom from '@/components/EmojiCom/Index.vue';
import { getToken } from '@/utils/authCookie';
const TOKEN_KEY = 'client_token';

export default {
  name: 'MessageArea',
  components: {
    NoticeMessage,
    MessageContent,
    EmojiCom,
  },
  watch: {
    currentChat: {
      handler: async function (newVal, oldVal) {
        if (newVal) {
          this.messages = [];
          await this.historyMessages();
          if (newVal.category === 'live' && oldVal?.category !== 'live') {
            this.initEventLister();
          }
          this.scrollToBottom();
        }
      },
      immediate: true,
    },
    quickMessage: {
      handler: function (newVal) {
        if (newVal) {
          this.sendMessageAction([newVal], this.clearQuickMessage);
        }
      },
    },
  },

  computed: {
    ...mapState('chatIM', {
      currentChat: (state) => state.currentChat,
      quickMessage: (state) => state.quickMessage,
    }),
  },
  data() {
    return {
      page: 1,
      size: 100,
      messages: [],
      showLoading: false,
      userInfo: {},
      showEmoji: false,
      newMessage: '',
      fileUrl: process.env.VUE_APP_FILE_URL,
      token: getToken(TOKEN_KEY),
      historyMeassageVisible: false,
      // 搜索结果: 消息 图片 文件
      textResult: [],
      imageResult: [],
      fileResult: [],
      linkResult: [],
      activeType: 'text',
      pickerOptions: {
        disabledDate(time) {
          // 如果 time 大于现在的时间，返回 true，这个日期将不可选
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      dateValue: '',
    };
  },

  async mounted() {
    try {
      this.userInfo = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.log(e);
    }
    this.initEventLister();
    await setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  },
  methods: {
    ...mapActions('chatWS', ['handleChatMessge']),
    ...mapActions('chatIM', ['changeLatestMessage', 'clearQuickMessage']),
    ...mapActions('liveWS', ['handleLiveMessge']),

    initEventLister() {
      if (this.currentChat.category === 'live') {
        this.handleChatMessge({
          type: ['live_chat_message_receive'],
          callback: (message) => {
            this.addRecentMessage(message);
          },
          id: 'chatInterface',
        });
      } else {
        this.handleChatMessge({
          type: [
            'chat_message_receive',
            'friend_add',
            'friend_recall',
            'group_recall',
            'group_increase',
            'group_decrease',
            'group_upload',
            'group_ban',
          ],
          callback: async (message) => {
            await this.addRecentMessage(message);
          },
          id: 'chatInterface',
        });
      }
    },
    MEmotion(emotion) {
      let input = document.getElementById('send_M');
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      this.newMessage =
        input.value.substring(0, startPos) +
        emotion +
        input.value.substring(endPos);
    },
    handleEnter(event) {
      if (event.ctrlKey) {
        // 如果按下了 Ctrl 键，那么换行
        this.newMessage += '\n';
      } else {
        // 否则，发送消息
        this.sendMessageContent(this.newMessage, () => {
          this.newMessage = '';
        });
      }
      // 阻止默认的 Enter 键行为
      event.preventDefault();
    },
    // 滑动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.scrollAnchor?.scrollIntoView();
      });
    },
    //FIXME: 暂时不支持本地图片上传
    // 用户上传图片的前置处理
    // beforeRead(file) {
    //   if (
    //     file.type !== 'image/jpeg' &&
    //     file.type !== 'image/png' &&
    //     file.type !== 'image/jpg'
    //   ) {
    //     this.$message.info('请上传jpg、jpeg、png格式图片');
    //     return false;
    //   }
    //   if (file.size > 1024 * 1024 * 5) {
    //     this.$message.info('图片大小不能超过5M');
    //     return false;
    //   }
    //   let quality = file.size > 1024 * 1024 * 2 ? 0.4 : 1;

    //   return new Promise((resolve, reject) => {
    //     new Compressor(file, {
    //       quality: quality, // 压缩质量，0-1之间
    //       success: (compressedFile) => {
    //         resolve(compressedFile);
    //       },
    //       error: (err) => {
    //         this.$message.error('发送失败');
    //         reject(err);
    //       },
    //     });
    //   });
    // },
    // // 发送图片
    // async sendImage(url) {
    //   const content = [
    //     {
    //       type: 'image',
    //       data: {
    //         url: url,
    //       },
    //     },
    //   ];
    //   let paramData = {
    //     category: this.currentChat.category,
    //     target_id: this.currentChat.target_id,
    //     content,
    //   };
    //   const messageData = {
    //     send_at: Date.now(),
    //     sender: {
    //       name: this.userInfo.name,
    //       username: this.userInfo.username,
    //       avatar: this.userInfo.avatar,
    //     },
    //     content,
    //   };
    //   this.messages.push(messageData);
    //   this.scrollToBottom();
    //   sendMessage(paramData)
    //     .then((res) => {
    //       const { statusCode, data } = res;
    //       if (statusCode === 200) {
    //         this.changeLatestMessage({ latestMessage: data });
    //       } else {
    //         this.$message.error('发送失败');
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // },
    // // 用户上传图片的后置处理
    // async afterRead(data) {
    //   const { url } = data;
    //   await this.sendImage(url);
    // },

    /**
     * @param {*} result
     * 处理ws上报的消息
     */
    async addRecentMessage(result) {
      const { data } = result || {};
      const { contact, latest_message, message_id } = data;
      const target = this.messages.find(
        (item) => item.message_id === message_id
      );
      if (target) return;
      if (contact.target_id !== this.currentChat.target_id) return;
      this.messages.push(latest_message);
      this.scrollToBottom();
    },

    async historyMessages() {
      const { target_id, category } = this.currentChat;
      const params =
        category === 'live'
          ? {
              page: this.page,
              size: this.size,
              live_id: target_id,
            }
          : {
              category,
              target_id,
              page: this.page,
              size: this.size,
            };
      this.showLoading = true;
      try {
        const fn =
          category === 'live' ? getLiveChatHistoryMessage : getHistoryMessage;
        const res = await fn(params);
        const { statusCode, data } = res;
        if (statusCode === 200) {
          const rows = data.items;
          rows.sort((a, b) => a.send_at - b.send_at);
          this.messages.unshift(...rows);
        } else {
          this.$messages.error('网络错误');
        }
        this.showLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 根据给定的时间和消息索引格式化时间。
     * @param {string} time - 需要格式化的时间戳字符串。
     * @param {number} index - 当前消息的索引。
     * @returns {string | null} 格式化的时间字符串或者null。
     */
    formatTime(time, index) {
      if (!time) return;
      if (index === 0) {
        // 如果当前消息是列表中的第一条（index === 0），直接返回格式化后的时间。
        return formatTimeText(time);
      } else {
        // dayjs比较当前消息时间和前一条消息时间的差异。时间差
        const preMessage = this.messages?.[index - 1];
        const diff = Math.abs(dayjs(time).diff(preMessage?.send_at, 'minutes'));
        if (diff >= 5) {
          // 间差大于或等于5分钟，则返回格式化后的时间
          return formatTimeText(time);
        } else {
          return null;
        }
      }
    },
    // 发送消息：文本框内/快捷消息
    sendMessageAction(content, callback) {
      const time = Date.now();
      const messageData = {
        send_at: time,
        sender: {
          name: this.userInfo.name,
          username: this.userInfo.username,
          avatar: this.userInfo.avatar,
        },
        content,
      };
      this.messages.push(messageData);
      this.scrollToBottom();
      const { category, target_id } = this.currentChat;
      let paramData =
        category === 'live'
          ? {
              live_id: target_id,
              content,
            }
          : {
              category,
              target_id,
              content,
            };
      const sendFn = category === 'live' ? sendLiveChatMessage : sendMessage;
      sendFn(paramData)
        .then((res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            // 更新左边联系人列表的最新消息
            category !== 'live' &&
              this.changeLatestMessage({ latestMessage: data });
            const targetIndex = this.messages.findIndex(
              (item) => item.send_at === time
            );
            this.messages.splice(targetIndex, 1, data);
          } else {
            messageData['send_error'] = true;
            const targetIndex = this.messages.findIndex(
              (item) => item.send_at === time
            );
            this.messages.splice(targetIndex, 1, messageData);
            this.$message.error('发送失败');
          }
          callback && callback();
        })
        .catch((error) => {
          console.error(error);
        });
    },

    sendMessageContent(newMessage, callback) {
      if (newMessage.trim() !== '') {
        // 分割消息
        // 分割消息
        let messageParts = newMessage
          .split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
          .filter((item) => item !== '');
        let content = messageParts.map((item) => {
          // 判断是否是表情
          if (item.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)) {
            return {
              type: 'face',
              data: {
                category: 2,
                code: item,
              },
            };
          } else {
            return {
              type: 'text',
              data: {
                text: item,
              },
            };
          }
        });
        this.sendMessageAction(content, callback);
      }
    },

    handleClick() {
      console.log('handleClick', this.activeType);
    },
    changeDate(value) {
      console.log('value', value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
