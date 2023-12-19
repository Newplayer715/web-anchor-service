<template>
  <!-- 重要事件 -->
  <div class="ImportantEvents">
    <!-- 头部 -->
    <div class="header">
      <div class="title">重要事件</div>
    </div>
    <!-- 客户头像姓名 -->
    <div class="customerName">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        :size="40"
      ></el-avatar>
      <div class="name">杰克·雅各·雷德克里夫</div>
    </div>
    <!-- 搜索栏 -->
    <div class="inputBar">
      <el-input
        placeholder="搜索..."
        prefix-icon="el-icon-search"
        v-model="inputValue"
        clearable
      >
        <el-button slot="append" @click="queryEventOnContent(inputValue)"
          >点击搜索</el-button
        >
      </el-input>
    </div>
    <!-- 功能栏 -->
    <div class="functionBar">
      <!-- 日期选择器 -->
      <span class="datePicker">
        <el-date-picker
          v-model="dateParam"
          type="date"
          placeholder="日期筛选"
          @change="queryEventOnDate"
        >
        </el-date-picker>
      </span>
      <!-- 新建事件按钮 -->
      <span class="addNewEvent">
        <el-button type="primary" @click="addNewEventDialogVisible = true"
          >新建事件</el-button
        >
        <SimpleInputDialog
          :simpleInputDialogVisible.sync="addNewEventDialogVisible"
          dialogTitle="新增事件"
          :isTextarea="true"
          @handleConfirm="addNewEvent"
        ></SimpleInputDialog>
      </span>
    </div>
    <div class="eventList">
      <div
        class="event"
        v-for="(event, index) in eventList"
        :key="index"
        @contextmenu.prevent="operateEvent(index)"
        @click="cancelEventOperate"
      >
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="cardHeader">
            <!-- 管理该事件的弹出框 -->
            <el-popover
              trigger="manual"
              placement="right"
              :visible-arrow="false"
              :value="eventOperateIndex === index"
            >
              <div class="eventOperateContent">
                <el-button type="danger" @click="delEvent(event.id)"
                  >删除</el-button
                >
                <el-button plain>操作</el-button>
                <el-button plain type="info" @click="cancelEventOperate"
                  >取消</el-button
                >
              </div>
              <!-- slot="reference"  -->
              <div class="moment" slot="reference">
                <span class="date">{{ event.date }}</span>
                <span class="time">{{ event.time }}</span>
              </div>
            </el-popover>
          </div>
          <div class="cardContent">{{ event.content }}</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleInputDialog from "@/components/SimpleInputDialog/SimpleInputDialog.vue";
import {
  addImportantEvent,
  delImportantEvent,
  getImportantEvent,
} from "@/services/api/customer/index";
import { formatDate, formatTime } from "@/utils/timezoneOffset";
export default {
  name: "ImportantEvents",
  components: {
    SimpleInputDialog,
  },
  data() {
    return {
      userId: localStorage.getItem("user_id"),
      inputValue: null,
      dateParam: null,
      eventOperateIndex: null, // 操作事件的索引
      addNewEventDialogVisible: false, // 新建事件的Dialog是否显示
      eventList: [], // 事件列表
    };
  },
  mounted() {
    this.loadEvents({ user_id: this.userId });
  },
  methods: {
    /**
     * 加载事件列表
     * @param { Object } params getImportantEvent请求API的query参数
     */
    async loadEvents(params) {
      try {
        const res = await getImportantEvent(params);
        if (res?.statusCode === 200) {
          this.eventList = res.data.map((item) => {
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
        console.error("加载事件列表", error);
      }
    },

    /**
     * 查询指定日期的事件列表
     */
    async queryEventOnDate(dateParam) {
      if (dateParam) {
        const { timestampStart, timestampEnd } =
          this.getDayStartAndEndTimestamp(dateParam);
        this.loadEvents({
          user_id: this.userId,
          start_timestamp: timestampStart,
          end_timestamp: timestampEnd,
        });
      } else {
        // 无日期时查询全部
        this.loadEvents({ user_id: this.userId });
      }
    },

    /**
     * 查询包含内容的事件列表
     */
    async queryEventOnContent(content) {
      if (!content || !content.trim()) {
        this.loadEvents({ user_id: this.userId });
      } else {
        this.loadEvents({ user_id: this.userId, content });
      }
    },

    /**
     * 操作指定的事件
     */
    operateEvent(index) {
      console.log("操作指定的事件-", index);
      this.eventOperateIndex = index;
    },

    /**
     * 取消操作指定的事件
     */
    cancelEventOperate() {
      this.eventOperateIndex = null;
    },

    /**
     * 删除指定的事件
     */
    async delEvent(id) {
      try {
        const res = await delImportantEvent(id);
        if (res?.statusCode === 204) {
          this.$message({
            message: "Successful",
            type: "success",
          });
          // 重新加载
          this.loadEvents({ user_id: this.userId });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[删除指定的事件]", error);
      }
      // 关闭操作弹框
      this.eventOperateIndex = null;
    },

    /**
     * 新增事件
     */
    async addNewEvent(newEvent) {
      try {
        const res = await addImportantEvent({
          user_id: this.userId,
          content: newEvent,
          timestamp: Math.floor(Date.now() / 1000),
        });
        if (res?.statusCode === 201) {
          this.$message({
            message: "Successful",
            type: "success",
          });
          // 重新加载
          this.loadEvents({ user_id: this.userId });
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("新增事件", error);
      }
    },

    /**
     * 获取某个日期当天 00:00:00时刻 与 23:59:59时刻 的时间戳
     * @param { Date } date
     * @return { Object } { timestampStart, timestampEnd }
     */
    getDayStartAndEndTimestamp(date) {
      const now = new Date(date);

      // 获取当天0点时间
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const timestampStart = Math.floor(startOfDay.getTime() / 1000);

      // 获取当天23:59:59时间
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
      const timestampEnd = Math.floor(endOfDay.getTime() / 1000);

      return { timestampStart, timestampEnd };
    },
  },
};
</script>

<style lang="scss" scoped>
.ImportantEvents {
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 0 30px;

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

  // 客户头像与姓名
  .customerName {
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .name {
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: left;
      color: #1f2329;
    }
  }

  .inputBar {
    height: 50px;
    margin-bottom: 20px;

    :deep .el-input__inner {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      padding-left: 38px;
    }

    :deep .el-input__prefix {
      font-size: 20px;
      line-height: 50px;
      left: 8px;
    }
  }

  .functionBar {
    display: flex;
    align-items: center;

    .datePicker {
      flex: 1;

      :deep .el-input__inner {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Bold;
        padding-left: 38px;
      }

      :deep .el-input__prefix {
        font-size: 20px;
        line-height: 50px;
        left: 8px;
        color: #4e5df1;
      }

      :deep .el-input__suffix {
        .el-input__icon {
          font-size: 18px;
          color: #f54a45;
        }
      }
    }

    .addNewEvent {
      flex: 2;
      margin-left: 15px;

      .el-button {
        height: 50px;
        width: 100%;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Bold;
      }
    }
  }

  .eventList {
    max-height: 820px;
    overflow: auto;
    margin-top: 20px;

    .event {
      margin-top: 20px;
      line-height: 24px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #1f2329;

      .el-card {
        border-radius: 5px;
        background-color: #dbf5e6;
      }

      :deep .el-card__header {
        padding: 18px 20px 0 20px;
        border-bottom: none;
        box-sizing: border-box;
      }

      :deep .el-card__body {
        padding: 10px 20px 20px 20px;
        box-sizing: border-box;
      }

      .moment {
        width: fit-content;
        font-size: 16px;

        .date {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
