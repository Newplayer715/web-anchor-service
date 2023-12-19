<template>
  <div class="AddOrDelGroupMembers">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="selfDialogVisible"
      width="36%"
      @close="closeDialog"
    >
      <!-- body -->
      <div class="elDialogBody">
        <div class="selectArea">
          <!-- 源数据 -->
          <div class="source">
            <!-- 搜索栏 -->
            <div class="inputBar">
              <el-input
                placeholder="搜索..."
                prefix-icon="el-icon-search"
                v-model="queryMemberName"
                clearable
              >
                <el-button
                  slot="append"
                  @click="queryMyFriendWithoutGroup(queryMemberName)"
                  >点击搜索</el-button
                >
              </el-input>
            </div>
            <!-- 列表标题 -->
            <div class="listTitle" v-if="model === 'add'">我的联系人</div>
            <div class="listTitle" v-if="model === 'del'">群成员</div>
            <!-- 成员列表 -->
            <div class="memberList custom-scrollbar">
              <el-checkbox-group v-model="targetMember">
                <el-checkbox
                  v-for="(member, index) in sourceMember"
                  :key="index"
                  :label="member"
                >
                  <div class="member">
                    <!-- 头像 -->
                    <div class="avatar">
                      <el-avatar :src="member.avatar" :size="30"></el-avatar>
                    </div>
                    <!-- 身份 -->
                    <div class="text">
                      <div class="name">{{ member.username }}</div>
                      <div class="userName">ID: {{ member.user_id }}</div>
                    </div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <!-- 分割线 -->
          <el-divider direction="vertical"></el-divider>

          <!-- 标记数据 -->
          <div class="target">
            <div class="selectedTip" v-if="model === 'add'">
              已选: {{ targetMember.length }}个联系人加入群聊
            </div>
            <div class="selectedTip" v-if="model === 'del'">
              已选: {{ targetMember.length }}个群成员删除
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
                    <el-avatar :src="member.avatar" :size="30"></el-avatar>
                  </div>
                  <div class="text">
                    <div class="name">{{ member.username }}</div>
                    <div class="userName">ID: {{ member.user_id }}</div>
                  </div>
                </div>
                <!-- 取消该成员的选中状态 -->
                <div class="cancel" @click="cancelSeclected(member.id)">
                  <div class="el-icon-close"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 尾部栏 -->
      <div slot="footer" class="elDialogBodyFooter">
        <el-button @click="selfDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="fetchAddGroupMembers"
          v-if="model === 'add'"
          >添 加</el-button
        >
        <el-button
          type="danger"
          @click="fetchDelGroupMembers"
          v-if="model === 'del'"
          >删 除</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGroupMembers,
  addGroupMembers,
  delGroupMembers,
} from "@/services/api/groupManagement/index";
export default {
  name: "AddOrDelGroupMembers",
  props: {
    // dialog是否显示
    addOrDelGroupMembersDialogVisible: {
      type: Boolean,
      default: false,
    },
    // 模式：'add'-邀请群成员 'del'-删除群成员
    model: {
      type: String,
      required: true,
    },
    // 群成员列表
    customerList: {
      type: Array,
    },
  },
  watch: {
    // 监听来自父组件的dialog可见性的变化
    addOrDelGroupMembersDialogVisible(newVal) {
      this.selfDialogVisible = newVal;
    },
    // 当本地dialog可见性更改时，通知父组件
    selfDialogVisible(newVal) {
      if (newVal !== this.addOrDelGroupMembersDialogVisible) {
        this.$emit("update:addOrDelGroupMembersDialogVisible", newVal);
      }
    },
  },
  computed: {
    // dialog标题
    dialogTitle() {
      if (this.model === "add") return "添加群成员";
      if (this.model === "del") return "删除群成员";
      return "Error: can't find prop [model]";
    },
  },
  data() {
    return {
      userId: localStorage.getItem("user_id"),
      selfDialogVisible: this.addOrDelGroupMembersDialogVisible,
      queryMemberName: null, // 搜索框的value
      sourceMember: [],
      targetMember: [], // 选中状态的成员
    };
  },
  async mounted() {
    if (this.model === "add") {
      this.sourceMember = await this.loadFriendsWithoutGroup({
        user_id: this.userId,
        group_id: 2, // TODO: 需修改
      });
    }
    if (this.model === "del") {
      this.sourceMember = this.customerList;
    }
  },
  methods: {
    /**
     * 取消成员的选中状态
     */
    cancelSeclected(id) {
      console.log(`取消成员的选中状态-targetMember-${this.targetMember}`);
      const foundIndex = this.targetMember.findIndex(
        (member) => member.id === id
      );
      if (foundIndex !== -1) {
        this.targetMember.splice(foundIndex, 1); // 移除找到的项
      }
      console.log(`取消成员的选中状态-targetMember-${this.targetMember}`);
    },

    /**
     * dialog关闭时触发
     */
    closeDialog() {
      this.targetMember = [];
      this.queryMemberName = null;
    },

    /**
     * 请求添加群成员
     */
    async fetchAddGroupMembers() {
      try {
        const member_ids = this.targetMember.map((member) => member.id);
        const res = await addGroupMembers({
          group_id: 2, // TODO: 需修改
          user_id: this.userId,
          member_ids,
        });
        if (res?.statusCode === 201) {
          this.$message({
            message: "Successful",
            type: "success",
          });
          this.$emit("refresh"); // 发射一个刷新群成员事件
          this.selfDialogVisible = false;
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[请求添加群成员]", error);
      }
    },

    /**
     * 请求删除群成员
     */
    async fetchDelGroupMembers() {
      try {
        const member_ids = this.targetMember.map((member) => member.id);
        const res = await delGroupMembers({
          group_id: 2, // TODO: 需修改
          user_id: this.userId,
          member_ids,
        });
        if (res?.statusCode === 200) {
          this.$message({
            message: "Successful",
            type: "success",
          });
          this.$emit("refresh"); // 发射一个刷新群成员事件
          this.selfDialogVisible = false;
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[请求删除群成员]", error);
      }
    },

    /**
     * 加载好友列表
     */
    async loadFriendsWithoutGroup(params) {
      try {
        const res = await getGroupMembers(params);
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
    async queryMyFriendWithoutGroup(username) {
      if (!username || !username.trim()) {
        this.sourceMember = await this.loadFriendsWithoutGroup({
          user_id: this.userId,
        });
      } else {
        this.sourceMember = await this.loadFriendsWithoutGroup({
          user_id: this.userId,
          group_id: 2, // TODO: 需修改
          username,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Index.scss";
</style>
