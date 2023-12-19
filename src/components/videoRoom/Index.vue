<template>
  <div class="liveRoomVideo" v-loading="loading">
    <div class="top">
      <div class="anchor">
        <div class="left">
          <div
            class="anchorImg"
            :style="{
              backgroundImage: 'url(' + broadcastInformation.avatar + ')',
            }"
          ></div>
          <div class="Mtitle">
            <div class="introduction">
              {{ broadcastInformation.introduction }}
            </div>
            <div class="live_name">{{ broadcastInformation.live_name }}</div>
          </div>
        </div>
        <div class="right">
          <el-tooltip
            class="item"
            effect="dark"
            :content="'服务器地址：' + server"
            placement="bottom"
          >
            <div
              class="iconfont icon-yunfuwuqi"
              style="color: #ffffff; font-size: 20px; cursor: pointer"
            ></div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="'推流码：' + push_stream_code"
            placement="bottom"
          >
            <div
              class="iconfont icon-erweima"
              style="
                color: #ffffff;
                font-size: 26px;
                margin-left: 20px;
                cursor: pointer;
              "
            ></div>
          </el-tooltip>
        </div>
      </div>
      <div class="hot">
        <div class="hots">
          <div
            class="iconfont icon-icon-test"
            style="color: #dc321c; font-size: 20px"
          ></div>
          <div class="hotData">
            直播热度： {{ broadcastInformation.view_count }}
          </div>
        </div>
        <el-popover placement="bottom" width="auto" trigger="click">
          <div class="list" @click="editTitlePopover">
            <div class="edit">
              <div
                class="iconfont icon-bianji"
                style="color: #fff; font-size: 16px"
              ></div>
            </div>
            <div class="title">编辑直播标题</div>
          </div>
          <div class="list" @click="editCover">
            <div class="uploadCover">
              <div
                class="iconfont icon-icon-test1"
                style="color: #fff; font-size: 16px"
              ></div>
            </div>
            <div class="title">上传直播封面</div>
          </div>
          <!-- <div class="list">
            <div class="uploadAvatar">
              <div
                class="iconfont icon-KJ_002"
                style="color: #fff; font-size: 16px"
              ></div>
            </div>
            <div class="title">上传头像</div>
          </div> -->
          <div class="setting" slot="reference">直播间设置</div>
        </el-popover>
      </div>
    </div>

    <div class="video-container" ref="video">
      <!-- 视频 -->
      <div class="video-containers">
        <!-- video.js -->
        <video
          id="player-container-anchor"
          preload="auto"
          playsinline
          webkit-playsinline
          class="video-js"
        ></video>
      </div>
    </div>

    <div class="bottom">
      <div class="left">
        <div class="anchorName">
          主播： {{ broadcastInformation.streamer_name }}
        </div>
        <div class="fans">粉丝： {{ broadcastInformation.fans_count }}</div>
      </div>
      <div class="right">
        <div class="status">
          <div class="start" v-if="broadcastInformation.status === '正在直播'">
            <div class="punctuation"></div>
            <div class="title">
              直播中
              {{ formattedTime }}
            </div>
          </div>
          <div class="stop" v-else>
            未开播&emsp;上次直播: {{ broadcastInformation.last_live_time }}
          </div>
        </div>
        <div
          class="stopButton"
          v-if="broadcastInformation.status === '正在直播'"
          @click="stopLive"
        >
          <div
            class="iconfont icon-shipin"
            @click="startVideoPlayback"
            style="color: #fff; font-size: 25px"
          ></div>
        </div>
        <div class="startButton" v-else @click="startLive">
          <div
            class="iconfont icon-guanbishipin"
            @click="startVideoPlayback"
            style="color: #fff; font-size: 25px"
          ></div>
        </div>
      </div>
    </div>

    <!-- 编辑封面 -->
    <el-dialog
      :title="$t('editInformation')"
      :visible.sync="editorialCover"
      width="30%"
    >
      <div class="editorialCover">
        <div class="title">图片</div>
        <div class="Mtitle">上传图片尺寸为 600*338px，图片大小不超过1000KB</div>
        <div class="Upload">
          <el-upload
            :action="coverUpload.FILE_UPLOAD"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="changeCover"
            :headers="headers"
          >
            <i class="el-icon-plus" style="color: #507cff"></i>
          </el-upload>
          <div
            class="pictureUpload"
            :style="{
              backgroundImage: 'url(' + broadcastInformation.cover_image + ')',
            }"
          ></div>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑头像 -->
    <el-dialog
      :title="$t('editInformation')"
      :visible.sync="editAnchor"
      width="30%"
    >
      <div class="editorialCover">
        <div class="title">图片</div>
        <div class="上传图片尺寸为 600*338px，图片大小不超过1000KB"></div>
      </div>
    </el-dialog>

    <!-- 编辑标题 -->
    <el-dialog
      :title="$t('editInformation')"
      :visible.sync="editTitle"
      width="30%"
    >
      <div class="editTitle">
        <div class="Mtitle">{{ $t("edit") }}{{ $t("title") }}</div>
        <el-input
          v-model="liveTitle"
          :placeholder="$t('speechSkills')"
          class="Input"
        ></el-input>
        <div class="generalButton">
          <div class="back" @click="editTitle = false">
            {{ $t("back") }}
          </div>
          <div class="save" @click="titleEditSave">{{ $t("save") }}</div>
        </div>
      </div>
    </el-dialog>

    
  </div>
</template>

<script>
import {
  getObspush,
  getLives,
  alterLives,
  alterStreamer,
} from "@/services/api/live/index";
import { getToken } from "@/utils/authCookie";
import { coverUpload } from "@/utils/config";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";
import TCPlayer from "tcplayer.js";
import "tcplayer.js/dist/tcplayer.min.css";
import { formatTimestamp } from "@/utils/timezoneOffset";
export default {
  name: "videoRoom",
  data() {
    return {
      coverUpload,
      headers: { Authorization: "Bearer " + getToken("client_token") },
      player: null, // 初始化播放器实例
      anchroPlayer: null,
      isLoading: true, //视频加载
      videoUrl: "",
      userId: 103,
      broadcastInformation: "", //直播间信息
      seconds: 0,
      loading: true,
      server: "", //服务器地址
      push_stream_code: "", //推流码
      editorialCover: false, //编辑封面
      editAnchor: false, //编辑头像
      editTitle: false, //编辑标题
      liveTitle: "",
    };
  },

  computed: {
    formattedTime() {
      const hours = Math.floor(this.seconds / 3600);
      const minutes = Math.floor((this.seconds % 3600) / 60);
      const remainingSeconds = this.seconds % 60;

      // 格式化为时分秒字符串
      return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
        2,
        "0"
      )} : ${String(remainingSeconds).padStart(2, "0")}`;
    },
  },

  async mounted() {
    await this.startTime();
    await this.getLiveData();
    await this.getLive();
    await this.videoCreate();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose(); // 清理视频播放器资源
    }
    // 在组件销毁前清除定时器
    clearInterval(this.timerInterval);
  },
  methods: {
    // 封面编辑
    changeCover(file) {
      console.log(file);
      alterStreamer(
        this.userId,
        this.broadcastInformation.live_name,
        file.url,
        this.broadcastInformation.avatar,
        this.broadcastInformation.username
      )
        .then(() => {
          this.$message({
            message: this.$t("changeAvatarSuccess"),
            type: "success",
          });
          // 获取最新状态
          this.getLiveData();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error(this.$t("changeMessageError"));
        });
    },
    // 标题编辑
    editTitlePopover() {
      this.editTitle = true;
      this.liveTitle = this.broadcastInformation.live_name;
    },
    titleEditSave() {
      alterStreamer(
        this.userId,
        this.liveTitle,
        this.broadcastInformation.cover_image,
        this.broadcastInformation.avatar,
        this.broadcastInformation.username
      )
        .then(() => {
          this.$message({
            message: this.$t("changeAvatarSuccess"),
            type: "success",
          });
          this.editTitle = false;
          // 获取最新状态
          this.getLiveData();
        })
        .catch((error) => {
          console.error(error);
          this.$message.error(this.$t("changeMessageError"));
        });
    },
    // 封面编辑
    editCover() {
      this.editorialCover = true;
    },
    startTime() {
      this.timerInterval = setInterval(() => {
        this.seconds++;
      }, 1000);
    },
    // 修改状态
    async performLiveAction(status) {
      this.loading = true;
      try {
        await alterLives(this.userId, status);
        // 获取最新状态
        this.getLiveData();
      } catch (error) {
        console.error(error);
      }
    },

    async stopLive() {
      await this.performLiveAction("已下播");
      clearInterval(this.timerInterval);
      if (this.player) {
        this.player.pause(); // 暂停视频播放器资源
      }
    },

    async startLive() {
      await this.performLiveAction("正在直播");
      this.player.play();
      // 清除之前的定时器
      clearInterval(this.timerInterval);

      // 重置计时器
      this.seconds = 0;

      // 启动一个新的定时器
      this.timerInterval = setInterval(() => {
        this.seconds++;
      }, 1000);
    },
    // 获取直播信息
    async getLiveData() {
      try {
        const response = await getLives(this.userId);
        this.broadcastInformation = response.data;

        // 假设 formatTimestamp 也是一个异步操作，使用 async/await 进行处理
        this.broadcastInformation.last_live_time = formatTimestamp(
          this.broadcastInformation.last_live_time
        );

        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
    // 获取直播源
    async getLive() {
      try {
        let res = await getObspush(this.userId);
        // console.log(res.data);
        this.videoUrl = res.data.play_address;
        this.server = res.data.server;
        this.push_stream_code = res.data.push_stream_code;
      } catch (error) {
        console.error(error);
      }
    },
    // 视频挂载
    videoCreate() {
      this.player = TCPlayer("player-container-anchor", {
        sources: [
          {
            src: this.videoUrl,
          },
        ],
        licenseUrl:
          "https://license.vod2.myqcloud.com/license/v2/1314615661_1/v_cube.license",
      });
    },
    startVideoPlayback() {},
    // //loading加载
    // handleVideo() {
    //   this.isLoading = this.$refs.videoElement.paused;
    // },
  },

  destroyed() {
    // 销毁播放器实例
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./Index.scss";
</style>
