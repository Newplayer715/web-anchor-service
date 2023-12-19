<template>
  <div class="Login">
    <!-- 外层容器 -->
    <el-row>
      <el-col :span="13">
        <div class="background">
          <img class="logo" src="@/assets/icons/Logo.png" />
          <div class="title">
            <div class="titleA">不只是解决问题</div>
            <div class="titleB">我们创造快乐体验！</div>
          </div>
          <div class="bottom">
            <img class="logoLittle" src="@/assets/icons/logoLittle.png" />
            <div class="titleL">{{ $t('customerService') }}</div>
          </div>
        </div>
        <div class=""></div>
      </el-col>
      <el-col :span="11">
        <div class="loginForm">
          <div class="top">
            <el-popover placement="bottom" width="270" trigger="click">
              <regionalLanguage></regionalLanguage>

              <div class="languageSwitch" slot="reference">
                <div class="selectorIcon"></div>
                <div class="title">Language</div>
                <i class="el-icon-arrow-up"></i>
              </div>
            </el-popover>
          </div>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            style="width: 100%"
          >
            <div class="center">
              <div class="title">{{ $t('login') }}</div>

              <div class="formData">
                <div class="titleM">{{ $t('account') }}</div>
                <el-form-item prop="username">
                  <el-input
                    v-model="ruleForm.username"
                    :placeholder="$t('enterAccount')"
                    class="elInput"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="formData">
                <div class="titleM">{{ $t('password') }}</div>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="ruleForm.password"
                    show-password
                    :placeholder="$t('enterPassword')"
                    class="elInput"
                  ></el-input>
                </el-form-item>
              </div>

              <el-checkbox v-model="isRememberPassword">{{ $t('rememberPassword') }}</el-checkbox>
            </div>
            <el-form-item>
              <div class="bottom">
                <div
                  class="login"
                  @click="login('ruleForm')"
                  v-loading.fullscreen.lock="fullscreenLoading"
                >
                {{ $t('login') }}
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import { getCommunicationChannel } from "@/services/api/im";
import regionalLanguage from "@/components/regionalLanguage/Index.vue";
import { mapActions } from "vuex";
export default {
  name: "LoginView",
  components: { regionalLanguage },
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      fullscreenLoading: false,
      isRememberPassword: true, //是否记住密码
      rules: {
        username: [
          { required: true, message: this.$t('enterUserName'), trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: this.$t('sizePrompt'),
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: this.$t('enterPassword'), trigger: "blur" }],
      },
    };
  },

  mounted() {
    this.decryptFn();
    // console.log(this.isRememberPassword);
  },
  methods: {
    ...mapActions("chatWS", [
      "createChatWS",
      "disconnectChatWS",
    ]),
    // 获取聊天websocket连接地址
    async initChatWS() {
      const res = await getCommunicationChannel();
      const { data, statusCode, statusText } = res || {};
      if (statusCode === 200) {
        const {
          link,
          heartbeat_interval: heartbeatInterval,
          ack_nbits: ackNbits,
          heartbeat_tolerance: heartbeatTolerance,
          max_reconnect_times: maxReconnectTimes,
          ack_interval: ackInterval,
        } = data || {};
        // 已登陆，连接聊天ws
        this.createChatWS({
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
        console.log(statusText);
      }
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          this.$store
            .dispatch("user/login", this.ruleForm)
            .then(async () => {
              await this.initChatWS();
              this.encryptFn();
              this.fullscreenLoading = false;
              this.$router.push("/");
            })
            .catch((Error) => {
              console.error(Error);
              this.fullscreenLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 加密信息
    encryptFn() {
      const key = process.env.VUE_APP_ENCRYPTION_KEY;

      if (this.isRememberPassword) {
        const userInfo = {
          username: this.ruleForm.username,
          password: this.ruleForm.password,
        };
        const userInfoStr = JSON.stringify(userInfo);
        const userInfoStrEncrypted = CryptoJS.AES.encrypt(
          userInfoStr,
          key
        ).toString();
        localStorage.setItem("userInfo", userInfoStrEncrypted);
      } else {
        localStorage.removeItem("userInfo");
      }
      // console.log( this.isRememberPassword);
      localStorage.setItem("isRememberPassword", this.isRememberPassword);
    },
    // 解密信息
    decryptFn() {
      const isRememberPassword = Boolean(
        localStorage.getItem("isRememberPassword")
      );
      this.isRememberPassword = isRememberPassword;
      // console.log("isRememberPassword",process.env.VUE_APP_ENCRYPTION_KEY);
      const key = process.env.VUE_APP_ENCRYPTION_KEY;

      const userInfoStrEncrypted = localStorage.getItem("userInfo");
      if (!userInfoStrEncrypted) return;
      const userInfoStr = CryptoJS.AES.decrypt(
        userInfoStrEncrypted,
        key
      ).toString(CryptoJS.enc.Utf8);
      const userInfo = JSON.parse(userInfoStr);
      this.ruleForm.username = userInfo.username;
      this.ruleForm.password = userInfo.password;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../Login/Login.scss";
</style>
