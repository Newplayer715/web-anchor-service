<template>
  <div class="CustomerInfoManagement">
    <el-dialog
      class="customerInfoManagementDialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="36%"
    >
      <div
        class="infoList"
        v-infinite-scroll
        infinite-scroll-disabled="disabled"
      >
        <div class="infoCard" v-for="(item, index) in infoList" :key="index">
          <el-card class="box-card" shadow="hover">
            <div class="info">
              <div class="label">{{ item.title }}</div>
              <div class="value">{{ item.content }}</div>
            </div>
            <div class="operate">
              <div class="edit">
                <el-button type="text" @click="editInfo(item, index)"
                  >编辑</el-button
                >
              </div>
              <div class="del">
                <div
                  class="button el-icon-delete"
                  @click="delInfo(index, item.id)"
                ></div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNewInfoDialogVisible = true"
          >新 增 信 息</el-button
        >
      </span>
    </el-dialog>
    <KeyValueInputDialog
      dialogTitle="编辑信息"
      :keyValueInputDialogVisible.sync="editInfoDialogVisible"
      :keyValuePair.sync="editedInfo"
      @handleConfirm="updateEditedInfo"
    ></KeyValueInputDialog>
    <KeyValueInputDialog
      :dialogTitle="`新增${dialogTitle}`"
      :keyValueInputDialogVisible.sync="addNewInfoDialogVisible"
      @handleConfirm="addNewInfo"
    ></KeyValueInputDialog>
  </div>
</template>

<script>
import KeyValueInputDialog from "@/components/KeyValueInputDialog/KeyValueInputDialog.vue";
export default {
  name: "CustomerInfoManagement",
  props: {
    dialogTitle: {
      type: String,
      default: "Error: can't find prop [dialogTitle]",
      required: true,
    },
    // Dialog是否显示
    customerInfoManagementDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
    // 客户信息
    customerInfo: {
      type: Array,
      required: true,
    },
    // 请求删除信息的API
    fetchDelFunction: {
      type: Function,
      default: () => {},
    },
    // 请求更新信息的API
    fetchUpdateFunction: {
      type: Function,
      default: () => {},
    },
    // 请求新增信息的API
    fetchAddFunction: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    KeyValueInputDialog,
  },
  data() {
    return {
      dialogVisible: this.customerInfoManagementDialogVisible, // Dialog是否显示
      infoList: this.customerInfo, // 信息列表
      addNewInfoDialogVisible: false, // 新增信息的Dialog否显示
      editInfoDialogVisible: false, // 编辑信息的Dialog否显示
      editedInfo: {}, // 被编辑的信息
      editedInfoIndex: null, // 被编辑的信息的索引
    };
  },
  watch: {
    // 监听来自父组件的dialog可见性的变化
    customerInfoManagementDialogVisible(newVal) {
      this.dialogVisible = newVal;
    },

    // 当本地dialog可见性更改时，通知父组件
    dialogVisible(newVal) {
      if (newVal !== this.customerInfoManagementDialogVisible) {
        this.$emit("update:customerInfoManagementDialogVisible", newVal);
      }
    },
  },
  methods: {
    /**
     * 点击了指定的信息的[编辑]
     */
    editInfo(item, index) {
      this.editedInfo = item;
      this.editedInfoIndex = index;
      this.editInfoDialogVisible = true;
    },

    /**
     * 删除指定的信息
     */
    async delInfo(index, id) {
      try {
        const res = await this.fetchDelFunction(id);
        console.log("CustomerInfoManagement-delInfo", res);
        if (res) {
          if (index !== -1) {
            this.infoList.splice(index, 1);
            this.$emit("update:customerInfo", this.infoList);
          }
        }
      } catch (error) {
        console.error("[CustomerInfoManagement-delInfo]", error);
      }
    },

    /**
     * 更新指定的信息
     */
    async updateEditedInfo(newInfo) {
      try {
        const res = await this.fetchUpdateFunction(this.editedInfo.id, newInfo);
        if (res) {
          this.infoList[this.editedInfoIndex] = newInfo;
          this.editedInfo = {}; // 被编辑的信息
          this.editedInfoIndex = null; // 被编辑的信息的索引
        }
      } catch (error) {
        console.error("[更新指定的信息]", error);
      }
    },

    /**
     * 新增新信息
     */
    async addNewInfo(newInfo) {
      try {
        const res = await this.fetchAddFunction(newInfo);
        console.log("CustomerInfoManagement-addNewInfo", res);
        if (res) {
          this.infoList.push(newInfo);
        }
      } catch (error) {
        console.error("[新增新信息]", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.customerInfoManagementDialog {
  :deep .el-dialog__body {
    padding: 30px 20px;
    border-bottom: 1px solid #dee0e3;
    height: 600px;
    overflow: auto;
  }

  :deep .el-dialog__footer {
    padding: 30px 20px;
  }

  .infoList {
    // display: grid;
    // grid-template-columns: repeat(2, 1fr);
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .infoCard {
      flex-basis: calc(50% - 20px);
    }

    :deep .el-card {
      height: 100%;
      width: 100%;

      .el-card__body {
        // width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .info {
          width: 80%;
          font-family: PingFang SC, PingFang SC-Bold;
          font-weight: 700;

          .label {
            width: 100%;
            font-size: 16px;
            color: #707477;
            margin-bottom: 8px;
          }

          .value {
            font-size: 14px;
            color: #1f2329;
            box-sizing: border-box;
            padding-right: 10px;
            // 文本溢出省略
            max-width: 294px;
            overflow: hidden;
            white-space: nowrap;
            word-break: break-all;
            text-overflow: ellipsis;
          }
        }

        .operate {
          width: 20%;
          display: flex;
          align-items: center;
          .edit {
            font-size: 16px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
          }

          .del {
            margin-left: 15px;
            .el-icon-delete {
              font-size: 18px;
              color: #f54a45;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
