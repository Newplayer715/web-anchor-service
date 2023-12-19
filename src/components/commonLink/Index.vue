<template>
  <div class="activeFile">
    <div class="title">{{ $t("commonlyUsedLink") }}</div>
    <div class="content" v-loading="loading">
      <ul
        class="infinite-list"
        v-infinite-scroll="load"
        style="overflow: auto; width: 100%"
      >
        <div class="linkLists" v-for="(item, index) in linkLists" :key="index">
          <div class="linkLogo"></div>
          <div class="linkContent">
            <div class="linkName">{{ item.name }}</div>

            <el-link type="primary" class="linkStyle">{{
              item.content
            }}</el-link>
            <div class="linkDetail">{{ item.time }}</div>
          </div>
          <div class="controls">
            <el-tooltip :content="$t('send')" placement="top" effect="light">
              <div
                class="iconfont icon-jijianfasong-xianxing" @click="linkSend(item)"
                style="font-size: 25px; color: #5868f3; margin: 0 10px;cursor: pointer;"
              ></div>
            </el-tooltip>
            <el-tooltip :content="$t('edit')" placement="top" effect="light">
              <div
                class="iconfont icon-bianji"
                @click="linkEdit(item)"
                style="font-size: 25px; color: #5868f3;cursor: pointer;"
              ></div>
            </el-tooltip>
            <el-tooltip :content="$t('delete')" placement="top" effect="light">
              <el-popconfirm
                :title="$t('deleteLinkPrompt')"
                @confirm="deleteLinksData(item.id)"
                :confirm-button-text="$t('confirm')"
                :cancel-button-text="$t('cancel')"
              >
                <div
                  slot="reference"
                  class="iconfont icon-shanchu"
                  style="font-size: 25px; color: #f54a45; margin: 0 10px;cursor: pointer;"
                ></div>
              </el-popconfirm>
            </el-tooltip>
            <el-tooltip :content="$t('copy')" placement="top" effect="light">
              <div
                class="iconfont icon-fuzhi"
                style="font-size: 32px; color: #5868f3;cursor: pointer;"
              ></div>
            </el-tooltip>
          </div>
        </div>
      </ul>
      <div class="uploadLink" @click="dialogLinkAdd = true">
        <div class="Mtitle">{{ $t("addLink") }}</div>

        <div
          class="iconfont icon-tianjia1"
          style="color: #fff; font-size: 28px"
        ></div>
      </div>
    </div>

    <!-- 链接添加弹窗 -->
    <el-dialog
      :title="$t('add') + $t('link')"
      :visible.sync="dialogLinkAdd"
      width="20%"
      :close-on-click-modal="false"
    >
      <div class="classify">
        <div class="Mtitle">{{ $t("link") }}{{ $t("title") }}</div>
        <el-input
          v-model="titleInput"
          :placeholder="$t('title')"
          class="Input"
        ></el-input>
      </div>
      <div class="Add">
        <div class="Mtitle">{{ $t("addLink") }}</div>
        <el-input
          v-model="linkValue"
          :placeholder="$t('link')"
          class="Input"
        ></el-input>
      </div>

      <div class="vcerbalAddition" @click="dialogLinkAdd = false">
        <div class="back" @click="dialogLinkAdd = false">{{ $t("back") }}</div>
        <div class="save" @click="addLinksData">{{ $t("save") }}</div>
      </div>
    </el-dialog>

    <!-- 链接编辑弹窗 -->
    <el-dialog
      :title="$t('edit')"
      :visible.sync="dialogLinkEdit"
      width="20%"
      :close-on-click-modal="false"
    >
      <div class="classify">
        <div class="Mtitle">{{ $t("link") }}{{ $t("title") }}</div>
        <el-input
          v-model="editTitle"
          :placeholder="$t('title')"
          class="Input"
        ></el-input>
      </div>
      <div class="Add">
        <div class="Mtitle">{{ $t("addLink") }}</div>
        <el-input
          v-model="editLink"
          :placeholder="$t('link')"
          class="Input"
        ></el-input>
      </div>

      <div class="vcerbalAddition">
        <div class="back" @click="dialogLinkEdit = false">{{ $t("back") }}</div>
        <div class="save" @click="editLinksData">{{ $t("save") }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLinks,
  addLinks,
  editLinks,
  deleteLinks,
} from "@/services/api/user/index";
import { formatTimestamp } from "@/utils/timezoneOffset";
import { mapState } from "vuex";
export default {
  name: "commonLink",
  props: {
    userId: Number,
    required: true,
  },
  data() {
    return {
      linkLists: [],
      dialogLinkAdd: false,
      dialogLinkEdit: false,
      linkValue: "", //新增链接
      titleInput: "",
      editLink: "", //链接修改
      editTitle: "", //标题修改
      editLinkId: "", //链接修改Id
      loading: true,
    };
  },
  computed: {
    ...mapState({
      currentChat: (state) => state.chatIM.currentChat,
    }),
  },
  async mounted() {
    await this.getLinkData();
  },

  methods: {
    // 链接发送
    linkSend(item) {
      // console.log(item);
      if (this.currentChat) {
        const content = {
          type: "link",
          data: {
            name: item.name,
            link: item.content,
          },
        };
        this.$store.dispatch("chatIM/setQuickMessage", content);
      } else {
        this.$message({
          message: this.$t("selectDialog"),
          type: "warning",
        });
      }
    },
    linkEdit(item) {
      this.editTitle = item.name;
      this.editLink = item.content;
      this.dialogLinkEdit = true;
      this.editLinkId = item.id;
    },
    // 链接删除
    deleteLinksData(id) {
      deleteLinks(id)
        .then(() => {
          this.getLinkData();
          this.$message({
            message: this.$t("deleteLinkSuccess"),
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: this.$t("deleteLinkError"),
            type: "error",
          });
          console.error(error);
        });
    },
    // 链接编辑
    editLinksData() {
      let data = {
        name: this.editTitle,
        content: this.editLink,
        user_id: this.userId,
      };
      // console.log(this.editLinkId);
      editLinks(this.editLinkId, data)
        .then(() => {
          this.getLinkData();
          this.$message({
            message: this.$t("editLinkSuccess"),
            type: "success",
          });
          this.dialogLinkEdit = false;
        })
        .catch((error) => {
          this.$message({
            message: this.$t("editLinkError"),
            type: "error",
          });
          console.error(error);
        });
    },

    // 获取链接
    getLinkData() {
      getLinks(this.userId)
        .then((res) => {
          this.linkLists = res.data.map((item) => ({
            ...item,
            time: formatTimestamp(item.timestamp),
          }));
          this.loading = false;
          // console.log(this.linkLists);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 链接增加
    addLinksData() {
      let data = {
        name: this.titleInput,
        content: this.linkValue,
        user_id: this.userId,
      };
      addLinks(data)
        .then(() => {
          this.getLinkData();
          this.$message({
            message: this.$t("addLinkSuccess"),
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: this.$t("addLinkError"),
            type: "error",
          });
          console.error(error);
        });
    },
    load() {},
  },
};
</script>

<style lang="scss" scoped>
@import "../commonLink/Index.scss";
</style>
