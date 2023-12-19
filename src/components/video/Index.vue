<template>
      <div class="video-container">
        <!-- 视频 -->
        <div class="video-containers">
          <!-- video.js -->
          <video
            id="player-container-anchor"
            preload="auto"
            playsinline
            webkit-playsinline
            class="video-js"
          >
          </video>
        </div>
      </div>
  </template>
  
  
  <script>
  // import videojs from "video.js";
  // import "video.js/dist/video-js.css";
  import TCPlayer from "tcplayer.js";
  import "tcplayer.js/dist/tcplayer.min.css";
  
  export default {
    name: "videoRoom",
    data() {
      return {
        player: null, // 初始化播放器实例
        anchroPlayer: null,
        isLoading: true, //视频加载
        videoUrl: 'webrtc://play.dabayuu.com/OBS/100',
      };
    },
  
    mounted() {
      this.player = TCPlayer('player-container-anchor', {
        sources: [{
        src: this.videoUrl,
      }],
      licenseUrl: 'https://license.vod2.myqcloud.com/license/v2/1314615661_1/v_cube.license'
      });
      // player.src("webrtc://play.dabayuu.com/OBS/clubcamisole");
    },
  
    methods: {
      startVideoPlayback() {
      },
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
  