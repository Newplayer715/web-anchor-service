<template>
  <div class="chatArea">
    <div class="head" v-if="currentChat">
      <div class="infomation">
        <el-avatar
          :src="currentChat && currentChat.avatar"
          :size="60"
        ></el-avatar>
        <div class="name">
          {{ currentChat.name }}
        </div>
      </div>
      <div class="action">
        <el-button icon="el-icon-folder">
          查看信息
          <i class="el-icon-arrow-down"></i>
          <!-- <i class="el-icon-arrow-up"></i> -->
        </el-button>
        <el-tooltip content="搜索聊天记录" placement="bottom" effect="light">
        <el-button type="text" @click="historyMeassageVisible = true">
          <i class="el-icon-search list-search"></i>
        </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="head" v-else></div>
    <div v-if="this.currentChat">
      <div class="content">
        <MessageArea></MessageArea>
      </div>
    </div>
    <div v-else class="nonChat">
      <div class="tipText">请选择一个会话开始聊天!</div>
    </div>
    <el-dialog title="搜索聊天记录" :visible.sync="historyMeassageVisible">
      <div class="searchDialogBody">
        <div class="inputBar">
          <el-input
            placeholder="请输入关键词，Enter键搜索"
            prefix-icon="el-icon-search"
            v-model="searchMessageKey"
            clearable
          >
          </el-input>
          <div class="messageSearchResult" v-if="searchResult.length">
            <div
              v-for="item in searchResult"
              :key="item.message_id"
              class="messageItem"
            >
              <div class="messageContent received">
                <div class="avatar avatar-left">
                  <el-avatar :src="item.sender.avatar" :size="50"></el-avatar>
                </div>
                <div class="message-content-left">
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
              </div>
            </div>
          </div>
          <div class="noData" v-else>
            <div class="titleBar">按照关键词搜索</div>
            <el-empty description="暂无数据"></el-empty>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MessageArea from '@/components/MessageArea/Index.vue';
import SearchTextMessages from '@/components/SearchTextMessages/Index.vue';
export default {
  name: 'ChatArea',
  components: {
    MessageArea,
    SearchTextMessages,
  },
  data() {
    return {
      historyMeassageVisible: false,
      searchMessageKey: '',
      searchResult: [],
    };
  },
  computed: {
    ...mapState('chatIM', {
      currentChat: (state) => state.currentChat,
    }),
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>
