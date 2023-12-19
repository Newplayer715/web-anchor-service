<template>
  <div class="AddressBook">
    <el-row>
      <el-col :span="6">
        <!-- 菜单 -->
        <div class="menu">
          <!-- 头部栏 -->
          <div class="topBar"></div>
          <div class="menuContent">
            <!-- 菜单选项-全部好友 -->
            <div
              class="all"
              @click="seclectedAll"
              :class="{ actived: seclectedClassificationIndex === null }"
            >
              <div class="text">全部好友</div>
              <div class="icon el-icon-arrow-right"></div>
            </div>
            <!-- 菜单选项-分类板块 -->
            <div class="classification">
              <!-- 头部栏 -->
              <div class="classificationTitleBar">
                <!-- 标题 -->
                <div class="title">
                  <div class="icon el-icon-menu"></div>
                  <div class="text">分类</div>
                </div>
                <!-- 操作区域 -->
                <div class="operatingArea">
                  <div class="btn" @click="createClassification">
                    <div class="icon el-icon-plus"></div>
                    <div class="text">创建分类</div>
                  </div>
                  <!-- 新建分类的Dialog -->
                  <el-dialog
                    title="创建分类"
                    :visible.sync="dialogVisible"
                    width="38%"
                  >
                    <!-- body -->
                    <div class="elDialogBody">
                      <div class="newClassificationName">
                        <div class="titleBar">分类标题</div>
                        <!-- 输入栏 -->
                        <div class="inputBar">
                          <el-input
                            placeholder="标题"
                            prefix-icon="el-icon-search"
                            v-model="newClassificationName"
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
                                @click="queryMyFriend(queryMyFriendwithName)"
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
                                  <!-- 头像 -->
                                  <div class="avatar">
                                    <el-avatar
                                      :src="member.avatar"
                                      :size="30"
                                    ></el-avatar>
                                  </div>
                                  <!-- 身份 -->
                                  <div class="text">
                                    <div class="name">
                                      {{ member.username }}
                                    </div>
                                    <div class="userName">
                                      {{ member.friend_id }}
                                    </div>
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
                              <!-- 取消该成员的选中状态 -->
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
                      <el-button @click="dialogVisible = false"
                        >{{ $t("cancel") }}</el-button
                      >
                      <el-button
                        type="primary"
                        @click="comfirmCreateClassification"
                        >{{ $t("save") }}</el-button
                      >
                    </div>
                  </el-dialog>
                </div>
              </div>
              <!-- 分类内容 -->
              <div class="classificationContent">
                <!-- 类目列表 -->
                <div
                  class="list custom-scrollbar"
                  v-show="classificationList.length !== 0"
                >
                  <div
                    class="item"
                    v-for="(item, index) in classificationList"
                    :key="index"
                    :class="{ actived: seclectedClassificationIndex === index }"
                    @contextmenu.prevent="operateClassification(index)"
                    @click="changeCurrentClassification(index, item.title)"
                  >
                    <!-- 客户类目管理弹出框 -->
                    <el-popover
                      trigger="manual"
                      placement="right"
                      :visible-arrow="false"
                      :value="classificationOperateIndex === index"
                    >
                      <div class="classificationOperateContent">
                        <el-button type="primary" plain>操作</el-button>
                        <el-button plain @click="cancelClassificationOperate"
                          >取消</el-button
                        >
                        <el-button
                          type="danger"
                          plain
                          @click="disbandClassification(item.title)"
                          >解散此分类</el-button
                        >
                      </div>
                      <!-- 客户类目Lable -->
                      <div class="label" slot="reference">
                        {{ item.title }} ({{ item.count }})
                      </div>
                    </el-popover>
                    <!-- 右箭头图标 -->
                    <div class="el-icon-arrow-right"></div>
                  </div>
                </div>
                <!-- 空 -->
                <div class="empty" v-show="classificationList.length === 0">
                  <el-empty description="暂无分类"></el-empty>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="content">
          <div class="titleBar">
            <!-- 客服栏 -->
            <div class="customerService"></div>
          </div>
          <FriendList
            :currentClassification="seclectedClassification"
          ></FriendList>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import FriendList from "@/components/FriendList/FriendList.vue";
import {
  getFriends,
  addClassification,
  getClassifications,
  delClassification,
} from "@/services/api/addressBook/index";
export default {
  name: "AddressBook",
  components: {
    FriendList,
  },
  data() {
    return {
      userId: localStorage.getItem("user_id"),
      queryMyFriendwithName: null, // 搜索已好友关系的好友的姓名参数
      dialogVisible: false, // 创建分类的对话框是否显示
      newClassificationName: null, // 创建分类的新分类的名字
      sourceMember: [], // 创建分类的对话框中的成员列表
      targetMember: [], // 创建分类的对话框中被选中的成员列表
      classificationList: [], // 客户分类列表
      classificationOperateIndex: null, // 当前显示的客户分类单项的操作气泡框的索引
      seclectedClassificationIndex: null, // 被选中的分类的索引
      seclectedClassification: "", // 被选中的分类
    };
  },
  mounted() {
    this.loadClassifications({ user_id: this.userId });
  },
  methods: {
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
     * 点击了【创建分类】按钮
     */
    createClassification() {
      this.dialogVisible = true;
      this.loadFriends({ user_id: this.userId });
    },

    /**
     * 加载好友列表
     */
    async loadFriends(params) {
      try {
        const res = await getFriends(params);
        if (res?.statusCode === 200) {
          this.sourceMember = res.data;
          console.log("this.sourceMember:", this.sourceMember);
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[加载好友列表]", error);
      }
    },

    /**
     * 查询指定条件的好友列表
     */
    async queryMyFriend(username) {
      if (!username || !username.trim()) {
        this.loadFriends({ user_id: this.userId });
      } else {
        this.loadFriends({ user_id: this.userId, username });
      }
    },

    /**
     * 确认新建分类
     */
    async comfirmCreateClassification() {
      try {
        const member_id = this.targetMember.map((member) => member.id);
        const res = await addClassification({
          user_id: this.userId,
          title: this.newClassificationName,
          member_id,
        });
        if (res?.statusCode === 201) {
          this.loadClassifications({ user_id: this.userId });
          this.$message({
            message: "New category successfully created",
            type: "success",
          });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("确认新建分类", error);
      }
      // 重置[创建分类]dialog的数据状态
      this.dialogVisible = false;
      this.targetMember = [];
      this.newClassificationName = null;
      this.queryMyFriendwithName = null;
    },

    /**
     * 右键单击'客户分类'单项时触发
     */
    operateClassification(index) {
      this.classificationOperateIndex = index;
      console.log(
        `右键单击'客户分类'单项时触发-classificationOperateIndex-${this.classificationOperateIndex}`
      );
    },

    /**
     * 取消操作客户分类
     */
    cancelClassificationOperate() {
      this.classificationOperateIndex = null;
      console.log(
        `右键单击'客户分类'单项时触发-classificationOperateIndex-${this.classificationOperateIndex}`
      );
    },

    /**
     * 解散该客户分类
     * @param { String } title 指定的分类的标题
     */
    async disbandClassification(title) {
      try {
        const res = await delClassification({
          user_id: this.userId,
          title,
        });
        if (res?.statusCode === 200) {
          // 隐藏操作弹框
          this.classificationOperateIndex = null;
          // 成功提示
          this.$message({
            message: "Successfully dismissed the category",
            type: "success",
          });
          // 重新加载列表数据
          this.loadClassifications({ user_id: this.userId });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * 加载客户分类列表
     * @param { Object } { user_id }
     */
    async loadClassifications(params) {
      try {
        const res = await getClassifications(params);
        if (res?.statusCode === 200) {
          this.classificationList = res.data;
          console.log("加载客户分类列表", this.classificationList);
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[加载客户分类列表]", error);
      }
    },

    /**
     * 切换当前选中的客户分类
     * @param { Number } index 该客户分类的索引
     * @param { String } title 该客户分类的文本标题
     */
    changeCurrentClassification(index, title) {
      this.seclectedClassificationIndex = index;
      this.seclectedClassification = title;
      // console.log(
      //   "切换当前选中的客户分类-index",
      //   this.seclectedClassificationIndex,
      //   this.seclectedClassification
      // );
    },

    /**
     * 选中[全部好友]
     */
    seclectedAll() {
      this.seclectedClassificationIndex = null;
      this.seclectedClassification = "";
      // console.log(
      //   "选中[全部好友]-this.seclectedClassificationIndex",
      //   this.seclectedClassificationIndex,
      //   this.seclectedClassification
      // );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/views/AddressBook/AddressBook.scss";
</style>
