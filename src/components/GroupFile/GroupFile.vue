<template>
  <div class="GroupFile">
    <el-dialog
      class="groupFileDialog"
      :visible.sync="dialogVisible"
      width="40%"
      @close="closeDialog"
    >
      <div slot="title" class="dialog-title">
        <span class="icon iconfont icon-folder"></span>
        <span class="text">群文件</span>
      </div>
      <div class="tabs" @click="cancelOperate">
        <el-tabs v-model="activeTabName" @tab-click="handleClick">
          <el-tab-pane label="图片与视频" name="multimedia">
            <!-- 图片与视频 -->
            <div class="multimedia">
              <div
                class="group"
                v-for="(group, groupIndex) in multimediaList"
                :key="groupIndex"
              >
                <div class="timeBar">
                  {{ group[0].date }} {{ group[0].time }}
                </div>
                <div class="list">
                  <div
                    class="item"
                    v-for="(item, itemIndex) in group"
                    :key="itemIndex"
                    @contextmenu.prevent="operateImg(groupIndex, itemIndex)"
                  >
                    <!-- 操作该图片的弹出框 -->
                    <el-popover
                      trigger="manual"
                      placement="right"
                      :visible-arrow="false"
                      :value="
                        imgGroupOperateIndex === groupIndex &&
                        imgOperateIndex === itemIndex
                      "
                    >
                      <div class="imgOperateContent">
                        <el-row>
                          <el-button plain>复制图片</el-button>
                          <el-button
                            type="danger"
                            plain
                            @click="delImg(groupIndex, itemIndex)"
                            >删除</el-button
                          >
                        </el-row>
                        <el-row>
                          <el-button
                            plain
                            @click="downloadImg(groupIndex, itemIndex)"
                            >下载图片</el-button
                          >
                          <el-button plain @click="cancelOperate"
                            >取消</el-button
                          >
                        </el-row>
                      </div>
                      <!-- slot="reference"  -->
                      <img
                        slot="reference"
                        class="img"
                        src="../../assets/images/img-test.webp"
                        alt=""
                      />
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="文件" name="document">
            <!-- 文件 -->
            <div class="document">
              <div
                class="group"
                v-for="(group, groupIndex) in documentList"
                :key="groupIndex"
              >
                <div class="timeBar">
                  {{ group[0].date }} {{ group[0].time }}
                </div>
                <div class="list">
                  <div
                    class="item"
                    v-for="(item, itemIndex) in group"
                    :key="itemIndex"
                    @contextmenu.prevent="operateDoc(groupIndex, itemIndex)"
                  >
                    <div class="itemContent">
                      <div class="docIcon iconfont icon-folder"></div>

                      <!-- 操作该文件的弹出框 -->
                      <el-popover
                        trigger="manual"
                        placement="right"
                        :visible-arrow="false"
                        :value="
                          docGroupOperateIndex === groupIndex &&
                          docOperateIndex === itemIndex
                        "
                      >
                        <div class="docOperateContent">
                          <el-button
                            plain
                            @click="downloadDoc(groupIndex, itemIndex)"
                            >下载文件</el-button
                          >
                          <el-button
                            type="danger"
                            plain
                            @click="delDoc(groupIndex, itemIndex)"
                            >删除</el-button
                          >
                          <el-button plain @click="cancelOperate"
                            >取消</el-button
                          >
                        </div>
                        <!-- slot="reference"  -->
                        <div class="docInfo" slot="reference">
                          <div class="docName">{{ item.fileName }}</div>
                          <div class="docAttr">
                            <span class="size">{{ item.size }}</span>
                            <span class="moment"
                              >{{ item.date }} {{ item.time }}</span
                            >
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-upload v-if="activeTabName === 'multimedia'" action="" multiple>
          <el-button type="primary" v-if="activeTabName === 'multimedia'"
            >上 传 图 片 / 视 频</el-button
          >
        </el-upload>
        <el-upload v-if="activeTabName === 'document'" action="" multiple>
          <el-button type="primary" v-if="activeTabName === 'document'"
            >上 传 文 件</el-button
          >
        </el-upload>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GroupFile",
  props: {
    // Dialog是否显示
    groupFileDialogVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      dialogVisible: this.groupFileDialogVisible, // Dialog是否显示
      activeTabName: "multimedia", // 选中的tab页
      imgGroupOperateIndex: null, // 触发操作弹出框的图片所在组的索引
      imgOperateIndex: null, // 触发操作弹出框的图片在组内的索引
      docGroupOperateIndex: null, // 触发操作弹出框的文件所在组的索引
      docOperateIndex: null, // 触发操作弹出框的文件在组内的索引

      multimediaList: [
        [
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
        ],
        [
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
        ],
        [
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
          },
        ],
      ],

      documentList: [
        [
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
        ],
        [
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
        ],
        [
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
          {
            date: "2025/12/12",
            time: "08:54AM",
            url: "../../assets/images/img-test.webp",
            fileName: "阿吉雷上飞机了卡数据",
            size: "354163",
          },
        ],
      ],
    };
  },
  watch: {
    // 监听来自父组件的dialog可见性的变化
    groupFileDialogVisible(newVal) {
      this.dialogVisible = newVal;
    },

    // 当本地dialog可见性更改时，通知父组件
    dialogVisible(newVal) {
      if (newVal !== this.groupFileDialogVisible) {
        this.$emit("update:groupFileDialogVisible", newVal);
      }
    },
  },
  methods: {
    /**
     * Dialog关闭时触发
     */
    closeDialog() {
      console.log("groupFileDialog");
    },

    /**
     * tab页切换
     */
    handleClick() {
      console.log("tab页切换");
    },

    /**
     * 操作指定的图片
     * @param { Number } groupIndex 触发操作弹出框的图片所在组的索引
     * @param { Number } itemIndex 触发操作弹出框的图片在组内的索引
     */
    operateImg(groupIndex, itemIndex) {
      this.imgGroupOperateIndex = groupIndex;
      this.imgOperateIndex = itemIndex;
    },

    /**
     * 取消操作指定的图片和文件
     */
    cancelOperate() {
      this.imgGroupOperateIndex = null;
      this.imgOperateIndex = null;
      this.docGroupOperateIndex = null;
      this.docOperateIndex = null;
    },

    /**
     * 下载指定的图片
     * @param { Number } groupIndex 图片所在组的索引
     * @param { Number } itemIndex 图片在组内的索引
     */
    downloadImg(groupIndex, itemIndex) {
      // 创建一个 <a> 标签
      const link = document.createElement("a");
      // 设置 <a> 标签的属性
      link.href = this.multimediaList[groupIndex][itemIndex].url;
      link.download = "downloaded-image.jpg"; // 设置下载的文件名
      // 触发点击事件
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    /**
     * 删除指定的图片
     * @param { Number } groupIndex 图片所在组的索引
     * @param { Number } itemIndex 图片在组内的索引
     */
    delImg(groupIndex, itemIndex) {
      this.multimediaList[groupIndex].splice(itemIndex, 1);
      this.imgGroupOperateIndex = null;
      this.imgOperateIndex = null;
    },

    /**
     * 操作指定的文件
     * @param { Number } groupIndex 触发操作弹出框的文件所在组的索引
     * @param { Number } itemIndex 触发操作弹出框的文件在组内的索引
     */
    operateDoc(groupIndex, itemIndex) {
      this.docGroupOperateIndex = groupIndex;
      this.docOperateIndex = itemIndex;
    },

    /**
     * 下载指定的文件
     * @param { Number } groupIndex 文件所在组的索引
     * @param { Number } itemIndex 文件在组内的索引
     */
    downloadDoc(groupIndex, itemIndex) {
      //   // 创建一个 <a> 标签
      //   const link = document.createElement("a");
      //   // 设置 <a> 标签的属性
      //   link.href = this.multimediaList[groupIndex][itemIndex].url;
      //   link.download = "downloaded-image.jpg"; // 设置下载的文件名
      //   // 触发点击事件
      //   document.body.appendChild(link);
      //   link.click();
      //   document.body.removeChild(link);
      console.log("下载指定的文件", groupIndex, itemIndex);
    },

    /**
     * 删除指定的文件
     * @param { Number } groupIndex 文件所在组的索引
     * @param { Number } itemIndex 文件在组内的索引
     */
    delDoc(groupIndex, itemIndex) {
      this.documentList[groupIndex].splice(itemIndex, 1);
      this.docGroupOperateIndex = null;
      this.docOperateIndex = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./GroupFile.scss";
</style>
