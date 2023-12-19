<template>
  <div class="userInfo">
    <el-row>
      <el-col :span="16">
        <div class="userInfoLeft">
          <img class="userAvatar" :src="imageUrl" />
          <div class="userMode">
            <div class="userModeTop">
              <div class="userName">{{ username }}</div>
              <el-popover placement="bottom" width="220" trigger="click">
                <div class="userPopup">
                  <div class="editData" @click="openDialog">{{ $t("edit") }}</div>
                  <div class="logOut" @click="logout">{{ $t("logout") }}</div>
                </div>
                <i
                  class="el-icon-s-fold"
                  style="font-size: 20px; cursor: pointer"
                  slot="reference"
                ></i>
              </el-popover>
            </div>
            <div class="userModeBottom">
              <div class="identity">{{ $t(identity) }}</div>
              <el-popover
                placement="right-start"
                title="切换状态"
                width="280"
                trigger="click"
                offset="4"
              >
                <div
                  class="statusList"
                  v-for="(item, index) in statusList"
                  :key="item.id"
                >
                  <div class="list" @click="changeStatus(index, item)">
                    <div class="listLeft">
                      <div  class="normal" v-if="item.id === 0"></div>
                      <div  class="status" v-else></div>
                      <div class="title">{{ $t(item.title) }}</div>
                    </div>
                    <el-radio v-model="radio" :label="index"> </el-radio>
                  </div>
                </div>
                <div
                  class="userStatus"
                  slot="reference"
                  v-if="status === 'normal'"
                >
                  {{ $t("normal") }}
                  <i class="el-icon-arrow-down"></i>
                </div>
                <div v-else class="userStatus stop" slot="reference">
                  {{ $t("pause") }}
                  <i class="el-icon-arrow-down"></i>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="userInfoRight">
          <!-- 切换语言 -->
          <el-popover placement="bottom" width="270" trigger="click">
            <regionalLanguage></regionalLanguage>

            <div class="languageSwitch" slot="reference">
              <div class="selectorIcon"></div>
              <div class="title">Language</div>
              <i class="el-icon-arrow-up"></i>
            </div>
          </el-popover>
        </div>
      </el-col>
    </el-row>

    <!-- 编辑对话框 -->
    <el-dialog :title="$t('editInformation')" :visible.sync="dialogFormVisible" width="30%">
      <div class="modificationContent">
        <el-upload
          class="avatar-uploader"
          :action="ProfileUpload.FILE_UPLOAD"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="loadParams"
          name="avatar"
          :show-file-list="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-s-custom avatar-uploader-icon"></i>
        </el-upload>

        <div class="modification">
          <div class="title">{{ $t("myNickName") }}</div>
          <el-input
            v-model="editName"
            :placeholder="$t('searchPrompt')"
            class="username"
          ></el-input>
          <div class="title">{{ $t("myIdentity") }}</div>
          <div class="identity">{{ $t(identity) }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="userInforSave"
          >{{ $t("save") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ProfileUpload } from "@/utils/config";
import { getUser, updateUser } from "@/services/api/user/index";
import regionalLanguage from "@/components/regionalLanguage/Index.vue";
export default {
  name: "userInfo",
  components: { regionalLanguage },
  data() {
    return {
      ProfileUpload,
      status: "",
      statusList: [
        { status: "normal", title: "normalState", id: 0 },
        { status: "pause", title: "pauseState", id: 1 },
      ],
      radio: "",
      dialogFormVisible: false,
      imageUrl: "",
      username: "",
      editName:'',
      identity: "csIdentity",
      userId: '',
      loadParams:{
        user_id:Number(localStorage.getItem("user_id"))
      }
    };
  },
  async mounted() {
    //FIXME: 待适配
    this.userId = Number(localStorage.getItem("user_id"));
    await this.getUserData();
    if (this.status === "normal") {
      this.radio = 0;
    } else {
      this.radio = 1;
    }
  },
  methods: {
    userInforSave(){
      const userData = {
        username: this.editName,
        status: this.status,
      };
      updateUser(this.userId, userData)
        .then(() => {
          
          this.getUserData();
          this.$message({
            message: this.$t("changeMessageSuccess"),
            type: "success",
          });
          this.dialogFormVisible = false
        })
        .catch((error) => {
          console.error(error);
          this.$message.error(this.$t("changeMessageError"));
        });
    },
    
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$message({
          message: "退出成功",
          type: "success",
        });
        this.$router.push("/Login");
      });
    },
    async getUserData() {
      if (this.userId) {
        try {
          let res = await getUser(this.userId);
          // console.log(res);
          this.status = res.data.status;
          this.username = res.data.username;
          this.imageUrl = res.data.avatar;
          const userString = JSON.stringify(res.data);
          localStorage.setItem("user", userString);
        } catch (error) {
          console.error(error);
        }
      } else {
        this.$message.error(this.$t("getCSinfoError"));
      }
    },

    changeStatus(index, item) {
      this.radio = index;
      this.status = item.status;
      // console.log(this.status);
      const userData = {
        username: this.username,
        status: item.status,
      };
      updateUser(this.userId, userData)
        .then(() => {
          this.getUserData();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error(this.$t("changeMessageError"));
        });
      // console.log(item);
    },
    openDialog() {
      this.editName = this.username
      this.dialogFormVisible = true;
    },
    // 上传成功回调
    async handleAvatarSuccess() {
      await this.getUserData()
      this.$message({
          message: this.$t("changeAvatarSuccess"),
          type: "success",
        });
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const isJPG = allowedImageTypes.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error(this.$t("avatarFormatPrompt"));
      }
      if (!isLt2M) {
        this.$message.error(this.$t("avatarSizePrompt"));
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../userInfo/index.scss";
</style>
