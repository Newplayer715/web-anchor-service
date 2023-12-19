<template>
  <div class="repository">
    <div class="title">{{ $t("knowledgeBase") }}</div>
    <div class="content">
      <ul class="infinite-list" v-infinite-scroll="load" style="overflow: auto" v-loading="loading">
        <div class="card" v-for="(item, index) in repositoryList" :key="index">
          <div class="top">
            <div class="time">{{ item.time }}</div>
            <div class="controls">
              <el-tooltip :content="$t('send')" placement="top" effect="light">
              <div
                class="iconfont icon-jijianfasong-xianxing"  @click="repositorySend(item)"
                style="font-size: 25px; color: #5868f3; margin: 0 10px;cursor: pointer;"
              ></div>
            </el-tooltip>
            <el-tooltip :content="$t('edit')" placement="top" effect="light">
              <div
                class="iconfont icon-bianji"
                @click="repositoryEdit(item)"
                style="font-size: 25px; color: #5868f3;cursor: pointer;"
              ></div>
            </el-tooltip>

            <el-tooltip :content="$t('delete')" placement="top" effect="light">
              <el-popconfirm
                :title="$t('deleteKnowledgeBasePrompt')"
                @confirm="deleteRepositoryData(item.id)"
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
          <div class="cardContent">
            <div class="cardTitle">{{ item.title }}</div>
            <div class="contentM">{{ item.content }}</div>
          </div>
        </div>
        <div class="uploadCard" @click="dialogRepository = true">
          <div class="button">
            <div class="Mtitle">{{ $t("addKnowledge") }}</div>

            <div
              class="iconfont icon-tianjia1"
              style="color: #fff; font-size: 28px"
            ></div>
          </div>
        </div>
      </ul>
    </div>

    <!-- 知识库添加 -->
    <el-dialog :title="$t('addKnowledgeBase')" :visible.sync="dialogRepository" width="20%" :close-on-click-modal="false">
      <div class="classify">
        <div class="Mtitle">{{ $t("knowledgeBase") }}{{ $t("title") }}</div>
        <el-input
          v-model="titleInput"
          :placeholder="$t('title')"
          class="Input"
        ></el-input>
      </div>
      <div class="Add">
        <div class="Mtitle">{{ $t("add") }}{{ $t("knowledgeBase") }}</div>
        <el-input
          v-model="repositoryValue"
          :placeholder="$t('knowledgeBase')"
          class="Input"
        ></el-input>
      </div>

      <div class="vcerbalAddition">
        <div class="back" @click="dialogRepository = false">{{ $t("back") }}</div>
        <div class="save" @click="addRepositoryData">{{ $t("save") }}</div>
      </div>
    </el-dialog>

    <!-- 知识库编辑弹窗 -->
    <el-dialog :close-on-click-modal="false"
      :title="$t('editKnow')"
      :visible.sync="dialogRepositoryEdit"
      width="20%"
    >
      <div class="classify">
        <div class="Mtitle">{{ $t("knowledgeBase") }}{{ $t("title") }}</div>
        <el-input
          v-model="editRepositoryTitle"
          :placeholder="$t('title')"
          class="Input"
        ></el-input>
      </div>
      <div class="Add">
        <div class="Mtitle">{{ $t("add") }}{{ $t("knowledgeBase") }}</div>
        <el-input
          v-model="editRepository"
          :placeholder="$t('knowledgeBase')"
          class="Input"
        ></el-input>
      </div>

      <div class="vcerbalAddition">
        <div class="back" @click="dialogRepositoryEdit = false">{{ $t("back") }}</div>
        <div class="save" @click="knowledgesEdit">{{ $t("save") }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getKnowledges,
  addKnowledges,
  editKnowledges,
  deleteKnowledges,
} from "@/services/api/user/index";
import {formatTimestamp} from "@/utils/timezoneOffset"
import { mapState } from "vuex";
export default {
  name: "repositoryComponent",
  props: {
    userId: Number,
    required: true,
  },
  data() {
    return {
      repositoryList: [],
      dialogRepository: false,
      dialogRepositoryEdit: false,
      titleInput: "", //知识库标题增加
      repositoryValue: "", //知识库增加

      editRepositoryTitle: "", //知识库标题修改
      editRepository: "", //知识库修改
      editRepositoryId: "", //知识库修改Id
      loading: true
    };
  },
  async mounted() {
    await this.getRepositoryData();
  },
  computed: {
    ...mapState({
      currentChat: (state) => state.chatIM.currentChat,
    }),
  },
  methods: {
    // 知识库发送
    repositorySend(item) {
      // console.log(item);
      if (this.currentChat) {
        const content = {
          type: "text",
          data: {
            text: item.content,
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
    // 获取知识库
    getRepositoryData() {
      getKnowledges(this.userId)
        .then((res) => {
          this.repositoryList = res.data.map(item=>({
            ...item,
            time:formatTimestamp(item.timestamp)
          }));
          this.loading = false
          // console.log(this.repositoryList);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // 知识库增加
    addRepositoryData() {
      let data = {
        title: this.titleInput,
        content: this.repositoryValue,
        user_id: this.userId,
      };
      addKnowledges(data)
        .then(() => {
          this.getRepositoryData();
          this.dialogRepository = false
          this.$message({
            message: this.$t("addKnowSuccess"),
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: this.$t("addKnowError"),
            type: "error",
          });
          console.error(error);
        });
    },
    // 知识库删除
    deleteRepositoryData(id) {
      deleteKnowledges(id).then(() => {
        this.getRepositoryData();
          this.$message({
            message: this.$t("deleteKnowSuccess"),
            type: "success",
          });
      }).catch((error) => {
          this.$message({
            message: this.$t("deleteKnowError"),
            type: "error",
          });
          console.error(error);
        });
    },

    repositoryEdit(item) {
      this.editRepositoryTitle = item.title;
      this.editRepository = item.content;
      this.dialogRepositoryEdit = true;
      this.editRepositoryId = item.id;
    },
    // 知识库编辑
    knowledgesEdit() {
      let data = {
        title: this.editRepositoryTitle,
        content: this.editRepository,
        user_id: this.userId,
      };
      // console.log(this.editLinkId);
      editKnowledges(this.editRepositoryId, data)
        .then(() => {
          this.getRepositoryData();
          this.$message({
            message: this.$t("editKnowSuccess"),
            type: "success",
          });
          this.dialogRepositoryEdit = false;
        })
        .catch((error) => {
          this.$message({
            message: this.$t("editKnowError"),
            type: "error",
          });
          console.error(error);
        });
    },

    load() {},
    //   handleChange(file, fileList) {
    //     this.fileList = fileList.slice(-3);
    //   },
  },
};
</script>

<style lang="scss" scoped>
@import "../repository/Index.scss";
</style>
