<template>
  <div class="ChatView">
    <el-row>
      <el-col :span="6">
        <div class="contentLeft">
          <div class="header"></div>
          <div class="main">
            <div class="searchBar">
              <el-popover
                placement="bottom"
                v-model="searchVisible"
                width="400"
              >
                <div
                  class="resultList"
                  v-if="searchGroup.length || searchCustomer.length"
                >
                  <div class="customerList">
                    <div class="title">联系人</div>
                    <div class="list">
                      <div
                        class="listItem"
                        v-for="(item, index) in searchCustomer"
                        :key="index"
                        @click="selectTarget(item)"
                      >
                        <el-avatar
                          :src="item.contact.avatar"
                          :size="50"
                        ></el-avatar>
                        <div class="info">
                          <div class="name">{{ item.contact.name }}</div>
                          <div class="idArea">
                            ID:{{ item.contact.target_id }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-divider></el-divider>
                  <div class="groupList">
                    <div class="title">群聊</div>
                    <div class="list">
                      <div
                        class="listItem"
                        v-for="(item, index) in searchGroup"
                        :key="index"
                        @click="selectTarget(item)"
                      >
                        <el-avatar
                          :src="item.contact.avatar"
                          :size="50"
                        ></el-avatar>
                        <div class="info">
                          <div class="name">{{ item.contact.name }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-divider></el-divider>
                  <div class="liveList">
                    <div class="title">广场</div>
                    <div class="list">
                      <div
                        class="listItem"
                        v-for="(item, index) in searchGroup"
                        :key="index"
                        @click="selectTarget(item)"
                      >
                        <el-avatar
                          :src="item.contact.avatar"
                          :size="50"
                        ></el-avatar>
                        <div class="info">
                          <div class="name">{{ item.contact.name }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="nodata">搜索不到联系人、群聊、广场</div>
                  <el-empty description="暂无数据"></el-empty>
                </div>
                <el-input
                  v-model="inputValue"
                  placeholder="请输入内容, Enter键搜索"
                  clearable
                  @keyup.enter.native="search('all', inputValue)"
                  @blur="hideSearchResult"
                  @clear="hideSearchResult"
                  @focus="showSearchResult"
                  @mousedown.prevent="handleInputMousedown"
                  slot="reference"
                ></el-input>
              </el-popover>
            </div>
            <div class="chatTypeTabs">
              <el-tabs
                v-model="activeChatTypeName"
                @tab-click="chatTypeTabClick"
              >
                <el-tab-pane label="客户" name="privateChat">
                  <ContactList
                    v-if="customerList.length"
                    :list="customerList"
                    type="private"
                  ></ContactList>
                  <div v-else>
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="群聊" name="groupChat">
                  <ContactList
                    v-if="groupList.length"
                    :list="groupList"
                    type="group"
                  ></ContactList>
                  <div v-else>
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="广场" name="publicChat">
                  <ContactList
                    v-if="liveContactList.length"
                    :list="liveContactList"
                    type="live"
                  ></ContactList>
                  <div v-else>
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="contentCenter">
          <ChatArea></ChatArea>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="contentRight">
          <el-container>
            <el-header>
              <userInfo></userInfo>
            </el-header>
            <el-container>
              <el-main>
                <div class="tabPane" v-show="currentToolTab === 0">
                  <!-- 工具包 -->
                  <toolkit></toolkit>
                </div>
                <div
                  class="tabPane"
                  v-show="
                    activeChatTypeName === 'privateChat' && currentToolTab === 1
                  "
                >
                  <!-- 客户信息 -->
                  <CustomerInfo></CustomerInfo>
                </div>
                <div
                  class="tabPane"
                  v-show="
                    activeChatTypeName === 'privateChat' && currentToolTab === 2
                  "
                >
                  <!-- 重要事件 -->
                  <ImportantEvents></ImportantEvents>
                </div>
                <div
                  class="tabPane"
                  v-show="
                    activeChatTypeName === 'groupChat' && currentToolTab === 1
                  "
                >
                  <!-- 群管理 -->
                  <GroupManagement></GroupManagement>
                </div>
                <div
                  class="tabPane"
                  v-show="
                    activeChatTypeName === 'publicChat' && currentToolTab === 1
                  "
                >
                  <!-- 房间管理 -->
                  <RoomManagement></RoomManagement>
                </div>
              </el-main>
              <el-aside width="70px">
                <div
                  class="tabLabel"
                  :class="{ active: currentToolTab === index }"
                  v-for="(tabLabel, index) in tabLabels[activeChatTypeName]"
                  :key="index"
                  @click="currentToolTab = index"
                >
                  <div class="icon" :class="tabLabel.icon"></div>
                </div>
              </el-aside>
            </el-container>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userInfo from "@/components/userInfo/Index.vue";
import toolkit from "@/components/toolkit/Index.vue";
import CustomerInfo from "@/components/CustomerInfo/CustomerInfo.vue";
import GroupManagement from "@/components/GroupManagement/GroupManagement.vue";
import RoomManagement from "@/components/RoomManagement/RoomManagement.vue";
import ImportantEvents from "@/components/ImportantEvents/ImportantEvents.vue";
import ContactList from "@/components/ContactsList/Index.vue";
import ChatArea from "@/components/ChatArea/Index.vue";
import {
  getRecentContactList,
  clearUnread,
  getLiveChatChannel,
  getLiveChatContactList,
} from "@/services/api/im";
import { mapActions, mapState } from "vuex";
export default {
  name: "ChatView",
  components: {
    userInfo,
    toolkit,
    CustomerInfo,
    GroupManagement,
    RoomManagement,
    ImportantEvents,
    ContactList,
    ChatArea,
  },
  computed: {
    ...mapState({
      currentChat: (state) => state.chatIM.currentChat,
      customerList: (state) => state.chatIM.customerList,
      groupList: (state) => state.chatIM.groupList,
      liveContactList: (state) => state.chatIM.liveContactList,
      liveWSObj: (state) => state.liveWS.liveWSObj,
    }),
  },
  data() {
    return {
      // 当前聊天类型的tab privateChat-客户页(私聊) groupChat-群聊 publicChat-广场
      activeChatTypeName: "privateChat",
      currentToolTab: 0, // 当前的工具栏tab
      tabLabels: {
        // 客户
        privateChat: [
          {
            label: "工具包",
            icon: "el-icon-suitcase",
          },
          {
            label: "客户信息",
            icon: "el-icon-user",
          },
          {
            label: "重要事件",
            icon: "el-icon-document",
          },
        ],
        // 群聊
        groupChat: [
          {
            label: "工具包",
            icon: "el-icon-suitcase",
          },
          {
            label: "群管理",
            icon: "el-icon-chat-line-round",
          },
        ],
        // 广场
        publicChat: [
          {
            label: "工具包",
            icon: "el-icon-suitcase",
          },
          {
            label: "房间管理",
            icon: "el-icon-microphone",
          },
        ],
      },
      inputValue: "",
      searchCustomer: [],
      searchGroup: [],
      searchLiveContact: [],
      searchVisible: false,
    };
  },
  mounted() {
    this.getContact("private");
    this.getContact("group");
    this.getLiveContact();
  },
  methods: {
    ...mapActions("chatIM", [
      "setCustomerList",
      "setGroupList",
      "setCurrentChat",
      "setLiveContactList",
    ]),
    ...mapActions("liveWS", [
      "createLiveWS",
      "disconnectLiveWS",
      "handleLiveMessge",
      "removeAllHandleLiveMessge",
    ]),
    chatTypeTabClick() {
      this.currentToolTab = 0;
    },
    showSearchResult() {
      this.searchVisible = true;
    },
    hideSearchResult() {
      this.searchVisible = false;
    },
    handleInputMousedown(event) {
      this.searchVisible = true;
      event.target.focus();
    },

    async search(category, param) {
      let name = param.trim();
      if (!name) {
        this.$message.warning("请输入搜索内容");
        return;
      }
      await this.getContact(category, name);
      this.searchVisible = true;
    },

    async readMessage({ category, target_id }) {
      const res = await clearUnread({
        category,
        target_id,
      });
      const { statusCode, data } = res || {};
      if (statusCode === 200) {
        let tempArr =
          category === "private" ? this.customerList : this.groupList;
        const targetIndex = tempArr.findIndex(
          (item) => item.contact.target_id === target_id
        );
        if (targetIndex !== -1) {
          tempArr[targetIndex].unread_message_count = data.unread_message_count;
          const fn =
            category === "private" ? this.setCustomerList : this.setGroupList;
          fn(tempArr);
        }
      } else {
        this.$message.error("服务端异常");
      }
    },

    async selectTarget(item) {
      const { contact } = item;
      this.setCurrentChat(contact);
      if (contact.category === "live") {
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

    async getContact(category, name) {
      try {
        const res = await getRecentContactList({
          name,
          category,
        });
        const { data, statusCode } = res;
        if (statusCode === 200) {
          if (category === "private") {
            this.setCustomerList(data.items);
          } else if (category === "group") {
            this.setGroupList(data.items);
          } else {
            // 将data.items中的数据分成两个数组，一个是客户，一个是群聊
            const customerList = [];
            const groupList = [];
            data.items.forEach((item) => {
              if (item.contact.category === "private") {
                customerList.push(item);
              } else if (item.contact.category === "group") {
                groupList.push(item);
              }
            });
            this.searchCustomer = customerList;
            this.searchGroup = groupList;
          }
        } else {
          this.$message.error("获取联系人列表失败");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getLiveContact(name) {
      try {
        const res = await getLiveChatContactList({ name });
        const { data, statusCode } = res;
        if (statusCode === 200) {
          if (name) {
            this.searchLiveContact = data.items;
          } else {
            this.setLiveContactList(data.items);
          }
        } else {
          this.$message.error("获取广场列表失败");
        }
      } catch (e) {
        console.log(e);
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
          this.$message.error("获取广场频道失败");
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../ChatView/ChatView.scss";
</style>
