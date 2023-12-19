<template>
  <div class="FriendList">
    <div class="contentContainer">
      <div class="header">
        <el-row>
          <el-col :span="2">
            <div class="title">全部好友</div>
          </el-col>
          <el-col :span="18">
            <!-- 搜索栏 -->
            <div class="searchBar">
              <el-input
                placeholder="搜索..."
                prefix-icon="el-icon-search"
                v-model="queryMyFriendwithName"
                :clearable="true"
              >
                <el-button
                  slot="append"
                  @click="queryMyFriend(queryMyFriendwithName)"
                  >点击搜索</el-button
                >
              </el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="control">
              <el-button
                type="primary"
                icon="el-icon-s-custom"
                @click="clickCreateGroupChat"
                >创建群聊</el-button
              >
              <!-- 创建群聊的Dialog -->
              <el-dialog
                title="创建群聊"
                :visible.sync="groupChatDialogVisible"
                width="38%"
                @close="resetGroupDialog"
              >
                <!-- body -->
                <div class="elDialogBody">
                  <!-- 新群名 -->
                  <div class="newGroupChatName">
                    <div class="titleBar">
                      <div class="blackFont">群聊名称</div>
                      <div class="redFont">(必填)</div>
                    </div>
                    <!-- 输入栏 -->
                    <div class="inputBar">
                      <el-input
                        placeholder="名称"
                        v-model="newGroupChatName"
                        clearable
                      >
                      </el-input>
                    </div>
                  </div>
                  <!-- 新群描述 -->
                  <div class="newGroupChatDescription">
                    <div class="titleBar">
                      <div class="blackFont">群描述</div>
                      <div class="greyFont">(选填)</div>
                    </div>
                    <!-- 输入栏 -->
                    <div class="inputBar">
                      <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="群描述"
                        v-model="newGroupChatDescription"
                        clearable
                      >
                      </el-input>
                    </div>
                  </div>
                  <div class="selectArea">
                    <!-- 源数据 -->
                    <div class="source">
                      <!-- 搜索栏 -->
                      <div class="inputBar">
                        <el-input
                          placeholder="搜索..."
                          prefix-icon="el-icon-search"
                          v-model="queryMyFriendwithName"
                          clearable
                        >
                          <el-button
                            slot="append"
                            @click="
                              queryMyFriendInGroupDialog(queryMyFriendwithName)
                            "
                            >点击搜索</el-button
                          >
                        </el-input>
                      </div>
                      <!-- 成员列表 -->
                      <div class="memberList custom-scrollbar">
                        <el-checkbox-group v-model="targetMember">
                          <el-checkbox
                            v-for="(member, index) in sourceMember"
                            :key="index"
                            :label="member"
                          >
                            <div class="member">
                              <div class="avatar">
                                <el-avatar
                                  :src="member.avatar"
                                  :size="30"
                                ></el-avatar>
                              </div>
                              <div class="text">
                                <div class="name">{{ member.username }}</div>
                                <div class="userName">
                                  {{ member.friend_id }}
                                </div>
                              </div>
                            </div>
                          </el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                    <el-divider direction="vertical"></el-divider>
                    <!-- 标记数据 -->
                    <div class="target">
                      <div class="selectedTip">
                        已选: {{ targetMember.length }}个成员加入
                      </div>
                      <!-- 成员列表 -->
                      <div class="memberList custom-scrollbar">
                        <div
                          class="member"
                          v-for="(member, index) in targetMember"
                          :key="index"
                        >
                          <div class="memberInfo">
                            <div class="avatar">
                              <el-avatar
                                :src="member.avatar"
                                :size="30"
                              ></el-avatar>
                            </div>
                            <div class="text">
                              <div class="name">{{ member.username }}</div>
                              <div class="userName">
                                {{ member.friend_id }}
                              </div>
                            </div>
                          </div>

                          <div
                            class="cancel"
                            @click="cancelSeclected(member.friend_id)"
                          >
                            <div class="el-icon-close"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 尾部栏 -->
                <div slot="footer" class="elDialogBodyFooter">
                  <el-button @click="groupChatDialogVisible = false"
                    >{{ $t("cancel") }}</el-button
                  >
                  <el-button type="primary" @click="comfirmCreateGroupChat"
                    >{{ $t("save") }}</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </el-col>
        </el-row>
        <!-- -------- -->
      </div>
      <!-- 好友表格列表 -->
      <div class="table" v-show="tableData.length !== 0">
        <el-table :data="tableData" style="width: 100%">
          <!-- 昵称 列 -->
          <el-table-column label="昵称" width="500px">
            <template slot-scope="scope">
              <el-avatar :src="scope.row.avatar" :size="50"></el-avatar>
              <div class="identity">
                <div class="name">{{ scope.row.username }}</div>
                <div class="userName">ID: {{ scope.row.friend_id }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- 备注 列 -->
          <el-table-column label="备注">
            <template slot-scope="scope">
              <div class="remark" :class="{ placeholder: !scope.row.notes }">
                {{ scope.row.notes ? scope.row.notes : "添加备注" }}
              </div>
              <el-button
                type="text"
                @click="editRemark(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
          <!-- 标签 列 -->
          <el-table-column label="标签">
            <template slot-scope="scope">
              <div class="tags">
                <el-tag
                  v-for="(tag, index) in scope.row.labels"
                  :key="index"
                  type="info"
                  effect="plain"
                >
                  {{ tag.name }}
                </el-tag>
              </div>
              <el-button type="text" @click="editTag(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 编辑备注 的Dialog -->
        <el-dialog
          class="remarkDialog"
          title="备注"
          :visible.sync="editRemarkDialogVisible"
          width="30%"
          @close="resetEditRemark"
        >
          <div class="input">
            <el-input v-model="newRemark" placeholder="输入备注"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editRemarkDialogVisible = false"
              >{{ $t("cancel") }}</el-button
            >
            <el-button type="primary" @click="comfirmEditRemark"
              >保 存</el-button
            >
          </span>
        </el-dialog>

        <!-- 编辑标签 的Dialog -->
        <el-dialog
          class="tagsDialog"
          title="标签"
          :visible.sync="editTagsDialogVisible"
          width="30%"
          @close="resetEditTags"
        >
          <!-- 搜索栏 -->
          <div class="input">
            <el-input
              v-model="queryTagParam"
              placeholder="请输入要查找的标签"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click="queryTag"
                >搜索</el-button
              >
            </el-input>
          </div>
          <!-- 标签们 -->
          <div class="tags">
            <div class="header">
              <div class="title">全部标签</div>
              <el-button type="text" @click="manageTags"
                >标签管理<i class="el-icon-arrow-right"></i
              ></el-button>
            </div>
            <div class="tagsList">
              <el-checkbox-group v-model="selectedTags">
                <el-checkbox
                  v-for="(tag, index) in showedTags"
                  :label="tag.id"
                  :key="index"
                >
                  <el-tag effect="plain">{{ tag.name }}</el-tag>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editTagsDialogVisible = false">{{ $t("cancel") }}</el-button>
            <el-button type="primary" @click="comfirmEditTags">保 存</el-button>
          </span>
        </el-dialog>

        <!-- 标签管理 的Dialog -->
        <el-dialog
          class="manageTagsDialog"
          title="标签管理"
          :visible.sync="manageTagsDialogVisible"
          width="20%"
          @close="resetManageTags"
        >
          <!-- 搜索栏 -->
          <div class="input">
            <el-input
              v-model="newTag"
              placeholder="请输入要新建的标签(10字)"
              clearable
              maxlength="10"
              show-word-limit
            >
              <el-button
                slot="append"
                icon="el-icon-circle-plus-outline"
                @click="createNewTag"
                >新建</el-button
              >
            </el-input>
          </div>
          <!-- 标签们 -->
          <div class="tags">
            <div class="tagsList">
              <div class="tag" v-for="(tag, index) in tags" :key="index">
                <div class="tagText">{{ tag.name }}</div>
                <div
                  class="tagDel el-icon-error"
                  @click="delTag(index, tag.id)"
                ></div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="previousDialog">上 一 步</el-button>
            <el-button type="primary" @click="manageTagsDialogVisible = false"
              >完 成</el-button
            >
          </span>
        </el-dialog>
      </div>

      <!-- 空状态 -->
      <div class="empty" v-show="tableData.length === 0">
        <el-empty description="暂无好友"></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getFriends,
  updateFriendInfo,
  getTags,
  createTag,
  delTag,
  addGroupChat,
} from "@/services/api/addressBook/index";
export default {
  name: "FriendList",
  props: {
    currentClassification: {
      type: String,
    },
  },
  components: {},
  data() {
    return {
      userId: localStorage.getItem("user_id"),
      queryMyFriendwithName: null, // 搜索已好友关系的好友的姓名参数
      groupChatDialogVisible: false, // 创建群聊的对话框是否展示
      newGroupChatName: null, // 新群聊名称
      newGroupChatDescription: null, // 新群聊描述
      sourceMember: [], // [创建群聊]dialog中的成员列表
      targetMember: [], // [创建群聊]dialog中被选中的成员列表
      tableData: [], // 好友列表
      tags: [], // 标签列表
      editIndex: -1, // 触发 编辑 的项的索引值
      editRemarkDialogVisible: false, // 编辑备注的Dialog是否显示
      newRemark: null, // 新备注
      editTagsDialogVisible: false, // 编辑标签的Dialog是否显示
      queryTagParam: null, // 查询 标签列表 的参数
      selectedTags: [], // 编辑标签的Dialog中选中的标签
      queryResultTags: [], // 查询指定标签的结果列表
      manageTagsDialogVisible: false, // 管理标签的Dialog是否显示
      newTag: null, // 新标签名
    };
  },
  computed: {
    // 标签列表渲染的数据源
    showedTags() {
      return this.queryResultTags.length === 0
        ? this.tags
        : this.queryResultTags;
    },
  },
  watch: {
    // 当选中的分类选项发生变化时
    async currentClassification(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }
      if (newVal === "") {
        this.tableData = await this.loadFriends({
          user_id: Number(this.userId),
        });
      } else {
        this.tableData = await this.loadFriends({
          user_id: Number(this.userId),
          title: newVal,
        });
      }
    },
  },
  async mounted() {
    this.tableData = await this.loadFriends({ user_id: Number(this.userId) });
    this.tags = await this.loadTags({ user_id: Number(this.userId) });
  },
  methods: {
    /**
     * 加载标签列表
     */
    async loadTags(params) {
      try {
        const res = await getTags(params);
        if (res?.statusCode === 200) {
          return res.data;
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("加载标签列表", error);
      }
    },

    /**
     * 取消成员的选中状态
     */
    cancelSeclected(friend_id) {
      console.log(`取消成员的选中状态-targetMember-${this.targetMember}`);
      console.log(`取消成员的选中状态-userName-${friend_id}`);
      const foundIndex = this.targetMember.findIndex(
        (member) => member.friend_id === friend_id
      );
      if (foundIndex !== -1) {
        this.targetMember.splice(foundIndex, 1); // 移除找到的项
      }
      console.log(`取消成员的选中状态-targetMember-${this.targetMember}`);
    },

    /**
     * 点击了[创建群聊]
     */
    async clickCreateGroupChat() {
      this.groupChatDialogVisible = true;
      this.sourceMember = await this.loadFriends({
        user_id: Number(this.userId),
      });
    },

    /**
     * 确认新建群聊
     */
    async comfirmCreateGroupChat() {
      try {
        const member_id = this.targetMember.map((member) => member.id);
        const res = await addGroupChat({
          user_id: Number(this.userId),
          group_name: this.newGroupChatName,
          group_describe: this.newGroupChatDescription
            ? this.newGroupChatDescription
            : undefined,
          member_id,
        });
        if (res?.statusCode === 201) {
          this.$message({
            message: "Created a new group chat successfully ~",
            type: "success",
          });
          this.groupChatDialogVisible = false; // 关闭dialog
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[确认新建群聊]", error);
      }
    },

    /**
     * [创建群聊]dialog关闭时触发
     */
    resetGroupDialog() {
      this.targetMember = [];
      this.newGroupChatName = null;
      this.newGroupChatDescription = null;
      this.queryMyFriendwithName = null;
    },

    /**
     * 编辑备注
     */
    editRemark(index, customerInfo) {
      console.log("编辑备注-index-", index);
      console.log("编辑备注-customerInfo-", customerInfo);
      this.editRemarkDialogVisible = true;
      this.editIndex = index;
      this.newRemark = customerInfo.notes;
    },

    /**
     * 编辑标签
     */
    editTag(index, customerInfo) {
      console.log("编辑标签-index-", index);
      console.log("编辑标签-customerInfo-", customerInfo);
      this.editTagsDialogVisible = true;
      this.selectedTags = customerInfo.labels.map((label) => label.id);
      this.editIndex = index;
    },

    /**
     * 重置 编辑备注
     */
    resetEditRemark() {
      this.editRemarkDialogVisible = false;
      this.editIndex = -1;
      this.newRemark = null;
    },

    /**
     * 确认 编辑备注
     */
    async comfirmEditRemark() {
      try {
        const id = this.tableData[this.editIndex].id;
        const friend_id = this.tableData[this.editIndex].friend_id;
        const res = await updateFriendInfo(id, {
          friend_id,
          notes: this.newRemark,
        });
        if (res?.statusCode === 200) {
          this.$message({
            message: "Successful ~ ",
            type: "success",
          });
          if (this.editIndex !== -1) {
            this.tableData[this.editIndex].notes = this.newRemark;
          }
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("确认了编辑备注", error);
      }
      this.resetEditRemark();
    },

    /**
     * 重置 编辑标签
     */
    resetEditTags() {
      this.editTagsDialogVisible = false;
      this.editIndex = -1;
      this.queryTagParam = null;
      this.queryResultTags = [];
      this.selectedTags = [];
    },

    /**
     * 搜索指定的标签
     */
    async queryTag() {
      console.log("搜索指定的标签");
      if (!this.queryTagParam || !this.queryTagParam.trim()) {
        // 无有效值
        this.queryTagParam = null;
        this.queryResultTags = [];
      } else {
        this.queryResultTags = await this.loadTags({
          user_id: Number(this.userId),
          name: this.queryTagParam,
        });
      }
    },

    /**
     * 管理标签
     */
    manageTags() {
      this.editTagsDialogVisible = false;
      this.manageTagsDialogVisible = true;
    },

    /**
     * 确认 编辑标签
     */
    async comfirmEditTags() {
      try {
        const id = this.tableData[this.editIndex].id;
        const friend_id = this.tableData[this.editIndex].friend_id;
        const label_ids = this.selectedTags;
        const res = await updateFriendInfo(id, {
          friend_id,
          label_ids,
        });
        if (res?.statusCode === 200) {
          this.$message({
            message: "Successful ~ ",
            type: "success",
          });
          this.tableData = await this.loadFriends({
            user_id: Number(this.userId),
          });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("确认 编辑标签", error);
      }
      this.resetEditTags();
    },

    /**
     * 重置 管理标签
     */
    resetManageTags() {
      this.manageTagsDialogVisible = false;
      this.newTag = null;
    },

    /**
     * 新建标签
     */
    async createNewTag() {
      try {
        const res = await createTag({
          name: this.newTag,
          user_id: Number(this.userId),
        });
        if (res?.statusCode === 201) {
          this.$message({
            message: "Successful ~ ",
            type: "success",
          });
          // 重新加载标签列表
          this.tags = await this.loadTags({ user_id: Number(this.userId) });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("新建标签", error);
      }
    },

    /**
     * 删除标签
     */
    async delTag(index, id) {
      try {
        const res = await delTag(id);
        if (res?.statusCode === 204) {
          this.$message({
            message: "Successfully deleted ~",
            type: "success",
          });
          // 重新加载标签列表
          this.tags = await this.loadTags({ user_id: Number(this.userId) });
        } else {
          this.$message.error("网络错误！请重试");
        }
      } catch (error) {
        console.error("[删除标签]", error);
      }
    },

    /**
     * 标签管理Dialog的[上一步]操作
     */
    previousDialog() {
      this.manageTagsDialogVisible = false;
      this.editTagsDialogVisible = true;
    },

    /**
     * 加载好友列表
     */
    async loadFriends(params) {
      try {
        const res = await getFriends(params);
        if (res?.statusCode === 200) {
          return res.data;
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("加载好友列表", error);
      }
    },

    /**
     * 查询指定条件的好友列表
     */
    async queryMyFriend(username) {
      if (!username || !username.trim()) {
        this.tableData = await this.loadFriends({ user_id: this.userId });
      } else {
        this.tableData = await this.loadFriends({
          user_id: this.userId,
          username,
        });
      }
    },

    /**
     * [创建群聊]dialog中查询指定条件的好友列表
     */
    async queryMyFriendInGroupDialog(username) {
      if (!username || !username.trim()) {
        this.sourceMember = await this.loadFriends({ user_id: this.userId });
      } else {
        this.sourceMember = await this.loadFriends({
          user_id: this.userId,
          username,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./FriendList.scss";
</style>
