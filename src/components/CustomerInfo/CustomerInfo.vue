<template>
  <!-- 客户信息 -->
  <div class="CustomerInfo">
    <!-- 头部 -->
    <div class="header">
      <div class="title">客户信息</div>
    </div>
    <!-- 客户头像姓名 -->
    <div class="customerName">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        :size="40"
      ></el-avatar>
      <div class="name">杰克·雅各·雷德克里夫</div>
    </div>
    <!-- 内容 -->
    <div class="customerInfoContent">
      <!-- 基础信息 -->
      <div class="basicInfo">
        <el-descriptions :column="1">
          <template slot="title">
            <div class="titileIcon el-icon-user-solid">基础信息</div>
          </template>
          <template slot="extra">
            <el-button
              type="primary"
              plain
              @click="basicInfoManagementDialogVisible = true"
              >基础信息管理</el-button
            >
          </template>
          <el-descriptions-item
            v-for="(item, index) in basicInfo"
            :key="index"
            :label="item.title"
            >{{ item.content ? item.content : "--" }}</el-descriptions-item
          >
        </el-descriptions>
        <!-- 基础信息管理Dialog -->
        <CustomerInfoManagement
          v-if="basicInfo.length !== 0"
          dialogTitle="基础信息"
          :customerInfo="basicInfo"
          :customerInfoManagementDialogVisible.sync="
            basicInfoManagementDialogVisible
          "
          :fetchDelFunction="fetchDelCustomerBaseInfo"
          :fetchUpdateFunction="fetchUpdateBaseInfo"
          :fetchAddFunction="fetchAddNewBaseInfo"
        ></CustomerInfoManagement>
      </div>
      <!-- 通讯信息 -->
      <div class="communicationInfo">
        <el-descriptions :column="1">
          <template slot="title">
            <div class="titileIcon el-icon-s-comment">通讯信息</div>
          </template>
          <template slot="extra">
            <el-button
              type="primary"
              plain
              @click="communicationInfoManagementDialogVisible = true"
              >通讯信息管理</el-button
            >
          </template>
          <el-descriptions-item
            v-for="(item, index) in communicationInfo"
            :key="index"
            :label="item.title"
          >
            <div class="itemContent">
              <div class="labelValue">
                {{ item.content ? item.content : "--" }}
              </div>
              <div class="control">
                <div class="copy el-icon-document-copy"></div>
                <div
                  class="status success el-icon-success"
                  v-show="item.content"
                ></div>
                <div
                  class="status error el-icon-circle-close"
                  v-show="!item.content"
                ></div>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <!-- 通讯信息管理Dialog -->
        <CustomerInfoManagement
          v-if="communicationInfo.length !== 0"
          dialogTitle="通讯信息"
          :customerInfo="communicationInfo"
          :customerInfoManagementDialogVisible.sync="
            communicationInfoManagementDialogVisible
          "
          :fetchDelFunction="fetchDelCommunicationInfo"
          :fetchUpdateFunction="fetchUpdateCommunicationInfo"
          :fetchAddFunction="fetchAddNewCommunicationInfo"
        ></CustomerInfoManagement>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerInfoManagement from "@/components/CustomerInfoManagement/CustomerInfoManagement.vue";
import {
  getCustomerBaseInfo,
  getCommunicationInfo,
  delCustomerBaseInfo,
  delCommunicationInfo,
  updateCustomerBaseInfo,
  updateCommunicationInfo,
  addCustomerBaseInfo,
  addCommunicationInfo,
} from "@/services/api/customer/index";
export default {
  name: "CustomerInfo",
  components: {
    CustomerInfoManagement,
  },
  data() {
    return {
      basicInfo: [], // 基础信息
      communicationInfo: [], // 通讯信息
      basicInfoManagementDialogVisible: false, // 基础信息管理的Dialog是否显示
      communicationInfoManagementDialogVisible: false, // 通讯信息管理的Dialog是否显示
    };
  },
  mounted() {
    this.loadCustomerBaseInfo(4, 1); // TODO: 需更改
    this.loadCommunicationInfo(4, 1); // TODO: 需更改
  },
  methods: {
    /**
     * 加载客户基础信息
     */
    async loadCustomerBaseInfo(user_id, customer_id) {
      try {
        const res = await getCustomerBaseInfo({ user_id, customer_id });
        console.log("加载客户基础信息", res);
        if (res?.statusCode === 200) {
          this.basicInfo = res.data.data;
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[加载客户基础信息]", error);
      }
    },

    /**
     * 加载客户通讯信息
     */
    async loadCommunicationInfo(user_id, customer_id) {
      try {
        const res = await getCommunicationInfo({ user_id, customer_id });
        console.log("加载客户通讯信息", res);
        if (res?.statusCode === 200) {
          this.communicationInfo = res.data.data;
        } else {
          this.$message.error("Network Error !");
        }
      } catch (error) {
        console.error("[加载客户通讯信息]", error);
      }
    },

    /**
     * 请求删除指定的基础信息
     */
    async fetchDelCustomerBaseInfo(id) {
      try {
        const res = await delCustomerBaseInfo(id);
        console.log("删除指定的基础信息", res);
        if (res?.statusCode === 204) {
          this.$message({
            message: "Successfully Deleted",
            type: "success",
          });
          return true;
        } else {
          this.$message.error("网络错误！请重试");
          return false;
        }
      } catch (error) {
        console.error("[删除指定的基础信息]", error);
      }
    },

    /**
     * 请求删除指定的通讯信息
     */
    async fetchDelCommunicationInfo(id) {
      try {
        const res = await delCommunicationInfo(id);
        console.log("删除指定的通讯信息", res);
        if (res?.statusCode === 204) {
          this.$message({
            message: "Successfully Deleted",
            type: "success",
          });
          return true;
        } else {
          this.$message.error("网络错误！请重试");
          return false;
        }
      } catch (error) {
        console.error("[删除指定的通讯信息]", error);
      }
    },

    /**
     * 请求更新指定的基础信息
     */
    async fetchUpdateBaseInfo(id, newInfo) {
      try {
        const res = await updateCustomerBaseInfo(id, newInfo);
        console.log("请求更新指定的基础信息", res);
        if (res?.statusCode === 200) {
          this.$message({
            message: "Successfully Updated",
            type: "success",
          });
          return true;
        } else {
          this.$message.error("网络错误！请重试");
          return false;
        }
      } catch (error) {
        console.error("[更新指定的信息]", error);
      }
    },

    /**
     * 请求更新指定的通讯信息
     */
    async fetchUpdateCommunicationInfo(id, newInfo) {
      try {
        const res = await updateCommunicationInfo(id, newInfo);
        console.log("请求更新指定的通讯信息", res);
        if (res?.statusCode === 200) {
          this.$message({
            message: "Successfully Updated",
            type: "success",
          });
          return true;
        } else {
          this.$message.error("网络错误！请重试");
          return false;
        }
      } catch (error) {
        console.error("[更新指定的通讯信息]", error);
      }
    },

    /**
     * 请求新增基础信息
     */
    async fetchAddNewBaseInfo(newInfo) {
      try {
        const res = await addCustomerBaseInfo({
          ...newInfo,
          user_id: Number(localStorage.getItem("user_id")),
          customer_id: 1, // TODO： 需修改
        });
        console.log("新增新信息", res);
        if (res?.statusCode === 201) {
          return true;
        } else {
          this.$message.error("网络错误！请重试");
          return false;
        }
      } catch (error) {
        console.error("[新增新信息]", error);
      }
    },

    /**
     * 请求新增通讯信息
     */
    async fetchAddNewCommunicationInfo(newInfo) {
      try {
        const res = await addCommunicationInfo({
          ...newInfo,
          user_id: Number(localStorage.getItem("user_id")),
          customer_id: 1, // TODO： 需修改
        });
        console.log("新增通讯信息", res);
        if (res?.statusCode === 201) {
          return true;
        } else {
          this.$message.error("网络错误！请重试");
          return false;
        }
      } catch (error) {
        console.error("[新增通讯信息]", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.CustomerInfo {
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

  // 内容
  .customerInfoContent {
    .titileIcon {
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #1f2329;
    }

    .titileIcon::before {
      margin-right: 10px;
    }

    :deep .el-descriptions-item__container {
      align-items: center;
    }

    :deep .el-descriptions-item__content {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #707477;
    }

    :deep .el-descriptions__header {
      margin-bottom: 15px;
    }

    :deep .el-descriptions__body {
      max-height: 399px;
      overflow: auto;
      padding-right: 10px;
    }

    // 基础信息
    .basicInfo {
      box-sizing: border-box;
      border-bottom: 1px solid #dee0e3;
      padding: 10px;
      // max-height: 480px;
      // overflow: auto;
    }

    // 通讯信息
    .communicationInfo {
      margin-top: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #dee0e3;
      padding: 10px;
      // max-height: 500px;
      // overflow: auto;

      .itemContent {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .control {
          font-size: 16px;

          .copy {
            margin-right: 30px;
            color: #f77f00;
            cursor: pointer;
          }

          .status {
            cursor: pointer;
          }

          .status.success {
            color: #67c23a;
          }

          .status.error {
            color: #e54a4f;
          }
        }
      }
    }
  }
}
</style>
