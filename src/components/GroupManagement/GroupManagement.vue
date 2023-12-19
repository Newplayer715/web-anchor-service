<template>
  <!-- 客户信息 -->
  <div class="GroupManagement">
    <!-- 头部 -->
    <div class="header">
      <div class="title">群管理</div>
    </div>
    <!-- 群成员 -->
    <div class="groupMember">
      <div class="titleBar">群成员(190)</div>
      <div class="memberList">
        <div class="member" v-for="(member, index) in memberList" :key="index">
          <el-avatar :src="member.avatar" :size="50"></el-avatar>
          <div class="memberName">{{ member.username }}</div>
          <div class="memberRole">{{ member.role }}</div>
        </div>
      </div>
      <!-- 查看所有成员 -->
      <div class="viewAll">
        <el-button
          type="primary"
          plain
          @click="viewAllMemberDialogVisible = true"
          >查看全部成员</el-button
        >
        <!-- 全部成员的Dialog -->
        <el-dialog
          title="韩素汐粉丝群"
          :visible.sync="viewAllMemberDialogVisible"
          width="39%"
          class="viewAllMemberDialog"
          @close="closeAllMemberDialogVisible"
        >
          <!-- body -->
          <div class="elDialogBody">
            <!-- 输入栏 -->
            <div class="inputBar">
              <el-input placeholder="搜索" v-model="queryMemberParam" clearable>
                <el-button slot="append">点击搜索</el-button>
              </el-input>
            </div>

            <div class="allMembers">
              <!-- 群管理员 -->
              <div class="management">
                <!-- 标题栏 -->
                <div class="titleBar">群管理员</div>
                <!-- 成员列表 -->
                <div class="memberList custom-scrollbar">
                  <div
                    class="member"
                    v-for="(item, index) in managementList"
                    :key="index"
                  >
                    <!-- 管理员 -->
                    <div
                      class="memberItem"
                      @contextmenu.prevent="operateManagement(index)"
                    >
                      <!-- 管理该管理员员的弹出框 -->
                      <el-popover
                        trigger="manual"
                        placement="right-end"
                        :value="managementOperateIndex === index"
                      >
                        <div class="memberOperateContent">
                          <el-button type="warning">取消管理员</el-button>
                          <el-button plain>操作</el-button>
                          <el-button plain @click="cancelmanagementOperate"
                            >取消</el-button
                          >
                        </div>
                        <!-- slot="reference"  -->
                        <div class="left" slot="reference">
                          <!-- 头像 -->
                          <div class="avatar">
                            <el-avatar
                              :src="item.avatar"
                              :size="30"
                            ></el-avatar>
                          </div>
                          <!-- 身份 -->
                          <div class="identity">
                            <div class="name">{{ item.username }}</div>
                            <div class="userName">
                              {{ item.user_id }}
                            </div>
                          </div>
                        </div>
                      </el-popover>
                      <!-- 角色 -->
                      <div class="role">{{ item.role }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分割线 -->
              <el-divider direction="vertical"></el-divider>

              <!-- 群成员 -->
              <div class="customer">
                <!-- 标题栏 -->
                <div class="titleBar">群成员</div>
                <!-- 成员列表 -->
                <div class="memberList custom-scrollbar">
                  <div
                    class="member"
                    v-for="(item, index) in customerList"
                    :key="index"
                  >
                    <!-- 成员 -->
                    <div
                      class="memberItem"
                      @contextmenu.prevent="operateMember(index)"
                    >
                      <!-- 管理该成员的弹出框 -->
                      <el-popover
                        trigger="manual"
                        placement="right-end"
                        :value="memberOperateIndex === index"
                      >
                        <div class="memberOperateContent">
                          <el-button type="primary">设为管理员</el-button>
                          <el-button plain>操作</el-button>
                          <el-button plain @click="cancelmemberOperate"
                            >取消</el-button
                          >
                        </div>
                        <!-- slot="reference"  -->
                        <div class="left" slot="reference">
                          <!-- 头像 -->
                          <div class="avatar">
                            <el-avatar
                              :src="item.avatar"
                              :size="30"
                            ></el-avatar>
                          </div>
                          <!-- 身份 -->
                          <div class="identity">
                            <div class="name">{{ item.username }}</div>
                            <div class="userName">
                              {{ item.user_id }}
                            </div>
                          </div>
                        </div>
                      </el-popover>
                      <!-- 角色 -->
                      <div class="role">{{ item.role }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑成员 邀请/删除 -->
      <div class="editMember">
        <el-button
          type="primary"
          round
          class="add"
          @click="showAddOrDelGroupMembersDialog('add')"
          >邀请</el-button
        >
        <el-button
          type="danger"
          plain
          round
          class="delete"
          @click="showAddOrDelGroupMembersDialog('del')"
          >删除</el-button
        >
      </div>
      <!-- 添加或删除 群成员 -->
      <AddOrDelGroupMembers
        v-if="addOrDelGroupMembersDialogVisible"
        :addOrDelGroupMembersDialogVisible.sync="
          addOrDelGroupMembersDialogVisible
        "
        :model="addOrDelGroupMembersDialogModel"
        :customerList="customerList"
        @refresh="refreshGroupMember"
      ></AddOrDelGroupMembers>
    </div>
    <!-- 群名称 -->
    <div class="groupName">
      <el-card shadow="hover">
        <div slot="header" class="header">
          <span>群名称</span>
          <el-button
            type="primary"
            plain
            @click="editGroupNameDialogVisible = true"
            >编辑<i class="el-icon-edit icon"></i
          ></el-button>
        </div>
        <div class="groupNameContent">{{ groupName }}</div>
      </el-card>
      <SimpleInputDialog
        :simpleInputDialogVisible.sync="editGroupNameDialogVisible"
        :originalValue.sync="groupName"
        dialogTitle="群名称"
        :fetchFunction="fetchUpdateGroupName"
      ></SimpleInputDialog>
    </div>
    <!-- 群描述 -->
    <div class="groupDescribe">
      <el-card shadow="hover">
        <div slot="header" class="header">
          <span>群描述</span>
          <el-button
            type="primary"
            plain
            @click="editGroupDescribeDialogVisible = true"
            >编辑<i class="el-icon-edit icon"></i
          ></el-button>
        </div>
        <div class="groupDescribeContent">{{ groupDescribe }}</div>
      </el-card>
      <SimpleInputDialog
        :simpleInputDialogVisible.sync="editGroupDescribeDialogVisible"
        :originalValue.sync="groupDescribe"
        dialogTitle="群描述"
        :isTextarea="true"
        :fetchFunction="fetchUpdateGroupDescribe"
      ></SimpleInputDialog>
    </div>
    <!-- 群公告 -->
    <div class="groupAnnouncement">
      <el-button
        type="primary"
        plain
        @click="groupAnnouncementManagementDialogVisible = true"
        >群公告管理<i class="el-icon-edit icon"></i
      ></el-button>
      <GroupAnnouncementManagement
        :groupAnnouncementManagementDialogVisible.sync="
          groupAnnouncementManagementDialogVisible
        "
      ></GroupAnnouncementManagement>
    </div>
    <!-- 群文件 -->
    <div class="groupFile">
      <el-button plain round @click="groupFileDialogVisible = true"
        ><i class="iconfont icon-folder icon"></i>查看文件</el-button
      >
      <GroupFile
        :groupFileDialogVisible.sync="groupFileDialogVisible"
      ></GroupFile>
    </div>
  </div>
</template>

<script>
import AddOrDelGroupMembers from "@/components/AddOrDelGroupMembers/Index.vue";
import SimpleInputDialog from "@/components/SimpleInputDialog/SimpleInputDialog.vue";
import GroupAnnouncementManagement from "@/components/GroupAnnouncementManagement/GroupAnnouncementManagement.vue";
import GroupFile from "@/components/GroupFile/GroupFile.vue";

import {
  getGroupChatInfo,
  updateGroupChatInfo,
  getGroupMembers,
} from "@/services/api/groupManagement/index";

export default {
  name: "GroupManagement",
  components: {
    AddOrDelGroupMembers,
    SimpleInputDialog,
    GroupAnnouncementManagement,
    GroupFile,
  },
  data() {
    return {
      memberList: [], // 预览的成员列表
      managementList: [], // 群管理员列表
      customerList: [], // 群成员列表
      groupName: "", // 群名
      groupDescribe: "", // 群描述
      viewAllMemberDialogVisible: false, // 全部成员的Dialog是否显示
      queryMemberParam: null, // 查询指定成员的参数
      memberOperateIndex: null, // 触发操作弹出框的成员的索引
      managementOperateIndex: null, // 触发操作弹出框的管理员的索引
      addOrDelGroupMembersDialogVisible: false, // 邀请/删除群成员的Dialog是否显示
      addOrDelGroupMembersDialogModel: "", // 邀请/删除群成员的Dialog的模式:'add','delete'
      editGroupNameDialogVisible: false, // 编辑群名称的Dialog是否显示
      editGroupDescribeDialogVisible: false, // 编辑群描述的Dialog是否显示
      groupAnnouncementManagementDialogVisible: false, // 群公告管理的Dialog是否显示
      groupFileDialogVisible: false, // 群文件的Dialog是否显示
    };
  },
  // watch: {

  // }
  mounted() {
    this.loadGroupChatInfo(2); // TODO: 参数需修改
    this.loadGroupMembers(2); // TODO: 参数需修改
  },
  methods: {
    /**
     * 操作指定的成员
     */
    operateMember(index) {
      console.log("操作指定的成员-", index);
      this.memberOperateIndex = index;
    },

    /**
     * 操作指定的管理员
     */
    operateManagement(index) {
      console.log("操作指定的成员-", index);
      this.managementOperateIndex = index;
    },

    /**
     * 取消操作指定的管理员
     */
    cancelmanagementOperate() {
      this.managementOperateIndex = null;
    },

    /**
     * 取消操作指定的成员
     */
    cancelmemberOperate() {
      this.memberOperateIndex = null;
    },

    /**
     * [全部成员]Dialog关闭时触发
     */
    closeAllMemberDialogVisible() {
      this.managementOperateIndex = null;
      this.memberOperateIndex = null;
    },

    /**
     * 显示[邀请/删除群成员]
     * @param { String } model 模式
     * - add 邀请
     * - del 删除
     */
    showAddOrDelGroupMembersDialog(model) {
      this.addOrDelGroupMembersDialogVisible = true;
      this.addOrDelGroupMembersDialogModel = model;
    },

    /**
     * 加载群的基本信息
     */
    async loadGroupChatInfo(group_id) {
      try {
        const res = await getGroupChatInfo({
          group_id,
        });
        if (res?.statusCode === 200) {
          this.groupName = res.data[0].group_name;
          this.groupDescribe = res.data[0].group_describe;
          console.log(res, this.groupName, this.groupDescribe);
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * 修改群的信息
     */
    async fetchUpdateGroupChatInfo(id, data) {
      try {
        const res = await updateGroupChatInfo(id, data);
        if (res?.statusCode === 200) {
          this.$message({
            message: "Successfully modified",
            type: "success",
          });
          return true;
        } else {
          this.$message.error("Network Error !");
          return false;
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * 修改群名
     */
    async fetchUpdateGroupName(id, groupName) {
      return await this.fetchUpdateGroupChatInfo(id, {
        group_name: groupName,
      });
    },

    /**
     * 修改群描述
     */
    async fetchUpdateGroupDescribe(id, groupDescribe) {
      return await this.fetchUpdateGroupChatInfo(id, {
        group_describe: groupDescribe,
      });
    },

    /**
     * 加载群成员
     * @param { Number } group_id
     */
    async loadGroupMembers(group_id) {
      try {
        const res = await getGroupMembers({
          group_id,
        });
        if (res?.statusCode === 200) {
          this.managementList = res.data.manage;
          this.customerList = res.data.member;
          this.memberList = this.getPreviewMemberList(
            this.managementList,
            this.customerList
          );
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * 处理得到预览的成员列表
     * @param { Array } managementList 管理员列表
     * @param { Array } customerList 成员列表
     * @returns { Array }
     */
    getPreviewMemberList(managementList, customerList) {
      // 创建一个新数组
      let newArray = [];

      // 首先将 manage 数组的成员复制到新数组中
      newArray = [...managementList];

      // 如果 newArray 的长度小于 6，从 member 数组中取出成员来填充
      if (newArray.length < 6) {
        newArray.push(...customerList.slice(0, 6 - newArray.length));
      }

      // 确保新数组的长度不超过 6
      newArray = newArray.slice(0, 6);

      return newArray;
    },

    /**
     * 收到子组件通知刷新群成员的事件
     */
    refreshGroupMember() {
      this.loadGroupMembers(2); // TODO: 参数需修改
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./GroupManagement.scss";
</style>
