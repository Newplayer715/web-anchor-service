<template>
  <div class="SimpleInputDialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="20%"
      @close="closeDialog"
    >
      <div class="input">
        <el-input
          v-if="isTextarea"
          type="textarea"
          :rows="6"
          maxlength="300"
          show-word-limit
          v-model="inputValue"
          placeholder="输入..."
        ></el-input>
        <el-input v-else v-model="inputValue" placeholder="输入..."></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("cancel") }}</el-button>
        <el-button type="primary" @click="confirmDialog">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SimpleInputDialog",
  props: {
    dialogTitle: {
      type: String,
      required: true,
    },

    // 输入框是否文本域模式
    isTextarea: {
      type: Boolean,
      default: false,
    },

    // Dialog是否显示
    simpleInputDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },

    // 原先的值 也是input想更新的值
    originalValue: {
      type: String,
    },

    // 请求函数
    fetchFunction: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      userId: localStorage.getItem("user_id"),
      dialogVisible: this.simpleInputDialogVisible, // Dialog是否显示
      inputValue: this.originalValue, // el-input的value
    };
  },
  watch: {
    // 监听来自父组件的dialog可见性的变化
    simpleInputDialogVisible(newVal) {
      this.dialogVisible = newVal;
    },

    // 当本地dialog可见性更改时，通知父组件
    dialogVisible(newVal) {
      if (newVal !== this.simpleInputDialogVisible) {
        this.$emit("update:simpleInputDialogVisible", newVal);
      }
    },

    // 监听来自父组件的originalValue的变化
    originalValue(newVal) {
      this.inputValue = newVal;
    },
  },
  methods: {
    /**
     * Dialog关闭时触发
     */
    closeDialog() {
      console.log("SimpleInputDialog");
    },

    /**
     * dialog [保存]操作
     */
    async confirmDialog() {
      // 原先有值 是更新行为
      if (this.originalValue) {
        const res = await this.fetchFunction(2, this.inputValue); // TODO： 群id参数需修改
        console.log("SimpleInputDialog-[保存]操作-更新行为", res);
        if (res) this.$emit("update:originalValue", this.inputValue);
      }
      // 原先无值 是新增行为
      if (!this.originalValue) {
        this.$emit("handleConfirm", this.inputValue); // 发射一个新的事件
        this.inputValue = null;
      }
      this.dialogVisible = false;
    },
  },
};
</script>

<style></style>
