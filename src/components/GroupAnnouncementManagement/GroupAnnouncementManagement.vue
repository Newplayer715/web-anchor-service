<template>
  <div class="GroupAnnouncementManagement">
    <el-dialog
      class="groupAnnouncementManagementDialog"
      title="群公告管理"
      :visible.sync="dialogVisible"
      width="48%"
    >
      <div class="announcementList">
        <div
          class="announcement"
          v-for="(item, index) in announcementList"
          :key="index"
        >
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="header">
              <!-- 发布者 相关信息 -->
              <div class="releaseInfo">
                <!-- 发布者 头像 -->
                <div class="avatar">
                  <el-avatar
                    :src="item.notice_user?.avatar"
                    :size="36"
                  ></el-avatar>
                </div>
                <!-- 发布者信息文本 -->
                <div class="infoText">
                  <div class="identity">
                    <div class="name">{{ item.notice_user?.username }}</div>
                    <div class="role">{{ item.notice_user?.role }}</div>
                  </div>
                  <div class="moment">
                    <div class="date">{{ item.date }}</div>
                    <div class="time">{{ item.time }}</div>
                  </div>
                </div>
              </div>
              <!-- 删除控件 -->
              <div
                class="button el-icon-delete"
                @click="delAnnouncement(item.id)"
              ></div>
            </div>
            <div class="text">{{ item.content }}</div>
          </el-card>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeAnnouncementDialogVisible = true"
          >发 布 新 公 告</el-button
        >
      </span>
    </el-dialog>
    <SimpleInputDialog
      :simpleInputDialogVisible.sync="makeAnnouncementDialogVisible"
      dialogTitle="发布新公告"
      :isTextarea="true"
      @handleConfirm="publishGroupAnnouncement"
    ></SimpleInputDialog>
  </div>
</template>

<script>
import SimpleInputDialog from "@/components/SimpleInputDialog/SimpleInputDialog.vue";
import {
  getGroupAnnouncement,
  addGroupAnnouncement,
  delGroupAnnouncement,
} from "@/services/api/groupManagement/index";
import { formatDate, formatTime } from "@/utils/timezoneOffset";
export default {
  name: "GroupAnnouncementManagement",
  props: {
    // Dialog是否显示
    groupAnnouncementManagementDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  components: {
    SimpleInputDialog,
  },
  data() {
    return {
      userId: localStorage.getItem("user_id"),
      dialogVisible: this.groupAnnouncementManagementDialogVisible, // Dialog是否显示
      makeAnnouncementDialogVisible: false, // 发布公告的Dialog否显示
      announcementList: [
        {
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          name: "糖🍬心",
          role: 2,
          roleText: "群主",
          date: "2024/12/25",
          time: "14:54PM",
          content:
            "前4年，11月份新房价格一直上涨。2018年至2021年，各年的11月相比10月，新房销售价格分别上涨4.42%、1.72%、1.08%和0.06%，平均涨幅是1.8%。今年上涨1.4%，低于前4年的平均值。",
        },
        {
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          name: "糖🍬心",
          role: 1,
          roleText: "管理员",
          date: "2024/12/25",
          time: "14:54PM",
          content:
            "11月份，全国新建住宅平均销售价格10166元/平方米，比10月微涨1.4%，销售额依旧疲软，同比下降32%。前4年，11月份新房价格一直上涨。2018年至2021年，各年的11月相比10月，新房销售价格分别上涨4.42%、1.72%、1.08%和0.06%，平均涨幅是1.8%。今年上涨1.4%，低于前4年的平均值。",
        },
        {
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          name: "糖🍬心",
          role: 2,
          roleText: "群主",
          date: "2024/12/25",
          time: "14:54PM",
          content:
            "11月份，全国新建住宅平均销售价格10166元/平方米，比10月微涨1.4%，销售额依旧疲软，同比下降32%。前4年，11月份新房价格一直上涨。2018年至2021年，各年的11月相比10月，新房销售价格分别上涨4.42%、1.72%、1.08%和0.06%，平均涨幅是1.8%。今年上涨1.4%，低于前4年的平均值。",
        },
        {
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          name: "糖🍬心",
          role: 2,
          roleText: "群主",
          date: "2024/12/25",
          time: "14:54PM",
          content:
            "11月份，全国新建住宅平均销售价格10166元/平方米，比10月微涨1.4%，销售额依旧疲软，同比下降32%。前4年，11月份新房价格一直上涨。2018年至2021年，各年的11月相比10月，新房销售价格分别上涨4.42%、1.72%、1.08%和0.06%，平均涨幅是1.8%。今年上涨1.4%，低于前4年的平均值。",
        },
        {
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          name: "糖🍬心",
          role: 1,
          roleText: "管理员",
          date: "2024/12/25",
          time: "14:54PM",
          content:
            "11月份，全国新建住宅平均销售价格10166元/平方米，比10月微涨1.4%，销售额依旧疲软，同比下降32%。前4年，11月份新房价格一直上涨。2018年至2021年，各年的11月相比10月，新房销售价格分别上涨4.42%、1.72%、1.08%和0.06%，平均涨幅是1.8%。今年上涨1.4%，低于前4年的平均值。",
        },
        {
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

          name: "糖🍬心",
          role: 1,
          roleText: "管理员",
          date: "2024/12/25",
          time: "14:54PM",
          content:
            "11月份，全国新建住宅平均销售价格10166元/平方米，比10月微涨1.4%，销售额依旧疲软，同比下降32%。前4年，11月份新房价格一直上涨。2018年至2021年，各年的11月相比10月，新房销售价格分别上涨4.42%、1.72%、1.08%和0.06%，平均涨幅是1.8%。今年上涨1.4%，低于前4年的平均值。",
        },
      ],
    };
  },
  watch: {
    // 监听来自父组件的dialog可见性的变化
    groupAnnouncementManagementDialogVisible(newVal) {
      this.dialogVisible = newVal;
    },

    // 当本地dialog可见性更改时，通知父组件
    dialogVisible(newVal) {
      if (newVal !== this.groupAnnouncementManagementDialogVisible) {
        this.$emit("update:groupAnnouncementManagementDialogVisible", newVal);
      }
    },
  },
  mounted() {
    this.loadGroupAnnouncement({ group_id: 2 }); // TODO: 群id需更改
  },
  methods: {
    /**
     * 删除指定的公告
     */
    async delAnnouncement(id) {
      try {
        const res = await delGroupAnnouncement(id);
        if (res?.statusCode === 204) {
          this.$message({
            message: "Successfully",
            type: "success",
          });
          this.loadGroupAnnouncement({ group_id: 2 }); // TODO: 群id需更改
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * 加载群公告列表
     * @param { Object } { group_id }
     */
    async loadGroupAnnouncement(params) {
      try {
        const res = await getGroupAnnouncement(params);
        if (res?.statusCode === 200) {
          console.log("加载群公告列表", res);
          this.announcementList = res.data.map((item) => {
            return {
              ...item,
              date: formatDate(item.timestamp),
              time: formatTime(item.timestamp),
            };
          });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * 发布群公告
     */
    async publishGroupAnnouncement(newAnnouncement) {
      try {
        const res = await addGroupAnnouncement({
          group_id: 2, // TODO: 群id需修改
          notice_user_id: this.userId,
          timestamp: Math.floor(Date.now() / 1000),
          content: newAnnouncement,
        });
        if (res?.statusCode === 201) {
          this.$message({
            message: "Successfully",
            type: "success",
          });
          this.loadGroupAnnouncement({ group_id: 2 }); // TODO: 群id需更改
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.groupAnnouncementManagementDialog {
  :deep .el-dialog__body {
    padding: 30px 20px 0 20px;
    border-bottom: 1px solid #dee0e3;
    height: 600px;
    overflow: auto;
  }

  :deep .el-dialog__footer {
    padding: 30px 20px;
  }

  .announcementList {
    box-sizing: border-box;
    padding-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    :deep .el-card {
      height: 100%;

      .el-card__header {
        border: none;
        padding: 18px 20px 0 20px;
      }
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .releaseInfo {
        display: flex;
        align-items: center;

        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .infoText {
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;

          .identity {
            display: flex;
            align-items: center;

            .name {
              line-height: 22px;
              font-size: 16px;
              color: #1f2329;
              margin-right: 10px;
            }

            .role {
              height: 17px;
              background-color: #6d2cfc;
              border-radius: 9px;
              box-sizing: border-box;
              padding: 0 8px;
              color: #ffffff;
              line-height: 17px;
              font-size: 12px;
            }
          }

          .moment {
            display: flex;
            align-items: center;
            color: #8a8995;
            line-height: 17px;
            font-size: 12px;

            .date {
              margin-right: 10px;
            }
          }
        }
      }

      .button {
        font-size: 18px;
        color: #f54a45;
        cursor: pointer;
      }
    }

    .text {
      line-height: 20px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #707477;
      white-space: pre-line;
    }
  }
}
</style>
