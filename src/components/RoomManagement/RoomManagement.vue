<template>
  <!-- 房间管理 -->
  <div class="RoomManagement">
    <!-- 头部 -->
    <div class="header">
      <div class="title">房间管理</div>
    </div>
    <div class="main">
      <div class="titleBar">禁言</div>
      <div class="inputBar">
        <el-input
          placeholder="搜索..."
          prefix-icon="el-icon-search"
          v-model="inputValue"
          clearable
        >
          <el-button slot="append">点击搜索</el-button>
        </el-input>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in memberList" :key="index">
          <div class="info">
            <div class="avatar">
              <el-avatar :src="item.avatar" :size="36"></el-avatar>
            </div>
            <div class="infoText">
              <div class="name">{{ item.name }}</div>
              <div class="message">聊天记录</div>
            </div>
          </div>
          <div class="control">
            <span
              class="muteIcon el-icon-turn-off-microphone"
              :class="{ redColor: item.muteDuration }"
            ></span>
            <el-select
              v-model="item.muteDuration"
              placeholder="请选择禁言时间"
              clearable
            >
              <el-option v-for="item in muteOptions" :key="item" :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomManagement",
  components: {},
  data() {
    return {
      memberList: [
        {
          name: "金刚狼",
          userName: "fjaljg",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          muteDuration: null,
        },
        {
          name: "金刚狼",
          userName: "fjaljg",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          muteDuration: null,
        },
        {
          name: "金刚狼",
          userName: "fjaljg",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          muteDuration: null,
        },
      ],
      muteOptions: ["1h", "3h", "6h", "24h", "永久"],
      inputValue: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.RoomManagement {
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 0 20px;

  .header {
    height: 69px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #dee0e3;

    .title {
      font-size: 18px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: left;
      color: #1f2329;
      line-height: 68px;
    }
  }

  .main {
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;

    .titleBar {
      height: 55px;
      box-sizing: border-box;
      padding-top: 20px;
      padding-bottom: 10px;
      line-height: 25px;
      font-size: 18px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #8f959e;
    }

    .inputBar {
      height: 50px;

      :deep .el-input__inner {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
      }
    }

    .list {
      .item {
        margin-top: 20px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .info {
          display: flex;
          align-items: center;

          .avatar {
            width: 36px;
            height: 36px;
            margin-right: 10px;
          }

          .infoText {
            line-height: 20px;
            height: 100%;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #1f2329;

            .message {
              color: #8f959e;
            }
          }
        }

        .control {
          display: flex;
          align-items: center;
          .muteIcon {
            font-size: 30px;
          }

          .muteIcon.redColor {
            color: #e14146;
          }
        }
      }
    }
  }
}
</style>
