<template>
  <div class="KeyValueInputDialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="20%"
      @close="closeDialog"
    >
      <!-- 新键值对的键 -->
      <div class="key">
        <div class="title">标题</div>
        <div class="keyName">
          <div class="input">
            <el-input
              v-model="selfKeyValuePair.title"
              placeholder="输入..."
            ></el-input>
          </div>
        </div>
      </div>
      <!-- 新键值对的值 -->
      <div class="value">
        <div class="title">内容</div>
        <div class="keyValue">
          <div class="input">
            <el-input
              v-model="selfKeyValuePair.content"
              placeholder="输入..."
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previousDialog">上 一 步</el-button>
        <el-button type="primary" @click="confirmDialog">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "KeyValueInputDialog",
  props: {
    dialogTitle: {
      type: String,
      required: true,
    },

    // Dialog是否显示
    keyValueInputDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },

    // 接受编辑的键值对
    keyValuePair: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: this.keyValueInputDialogVisible, // Dialog是否显示
      selfKeyValuePair: this.keyValuePair
        ? JSON.parse(JSON.stringify(this.keyValuePair))
        : {}, // 接受编辑的键值对
    };
  },
  watch: {
    // 监听来自父组件的dialog可见性的变化
    keyValueInputDialogVisible(newVal) {
      this.dialogVisible = newVal;
    },

    // 当本地dialog可见性更改时，通知父组件
    dialogVisible(newVal) {
      if (newVal !== this.keyValueInputDialogVisible) {
        this.$emit("update:keyValueInputDialogVisible", newVal);
      }
    },

    // 监听来自父组件的keyValuePair的变化
    keyValuePair(newVal) {
      this.selfKeyValuePair = JSON.parse(JSON.stringify(newVal));
    },
  },
  methods: {
    /**
     * Dialog关闭时触发
     */
    closeDialog() {
      console.log("KeyValueInputDialog");
    },

    /**
     * [上一步]操作的dialog
     */
    previousDialog() {
      this.$emit("update:keyValueInputDialogVisible", false);
    },

    /**
     * dialog [保存]操作
     */
    confirmDialog() {
      this.$emit("handleConfirm", this.selfKeyValuePair); // 发射一个新的事件
      this.$emit("update:keyValueInputDialogVisible", false);
      if (!this.keyValuePair) {
        this.selfKeyValuePair = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.KeyValueInputDialog {
  .title {
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    text-align: left;
    color: #1f2329;
    margin-bottom: 15px;
  }

  .keyName {
    margin-bottom: 30px;
  }
}
</style>
