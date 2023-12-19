<template>
  <div class="activeFile">
    <div class="title">{{ $t("commonlyUsedFiles") }}</div>
    <div class="content">
      <ul
        class="infinite-list"
        v-infinite-scroll="load"
        style="overflow: auto"
        v-loading="loading"
        
      >
        <el-upload
          class="upload-demo"
          :action="fileUpload.FILE_UPLOAD"
          :file-list="fileList"
          list-type="picture"
          :data="loadFileParams"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload"
        >
          <div class="uploadFiles">
            <div class="Mtitle">{{ $t("uploadFile") }}</div>

            <div
              class="iconfont icon-tianjia1"
              style="color: #fff; font-size: 28px"
            ></div>
          </div>
          <div slot="tip" class="el-upload__tip">
            {{ $t("fileSizePrompt") }}
          </div>
          <div slot="file" slot-scope="{ file }" class="fileList">
            <el-image
              v-if="file.type === 'image'"
              :src="file.file"
              :preview-src-list="[file.file]"
              class="fileImg"
            ></el-image>
            <div
              v-else
              class="iconfont icon-folder"
              style="color: #ffb300; font-size: 40px"
            ></div>
            <div class="center">
              <span class="fileName">{{ file.name }}</span>
              <span class="fileDetail">{{ file.size }} , {{ file.time }}</span>
            </div>
            <div class="controls">
              <el-tooltip :content="$t('send')" placement="top" effect="light">
                <div
                  class="iconfont icon-jijianfasong-xianxing" @click="fileSend(file)"
                  style="font-size: 25px; color: #5868f3;cursor: pointer;"
                ></div>
              </el-tooltip>
              <el-tooltip :content="$t('delete')" placement="top" effect="light">
              <el-popconfirm
                :title="$t('deleteFilePrompt')"
                @confirm="deleteFileData(file.id)"
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
            </div>
          </div>
        </el-upload>
      </ul>
    </div>
  </div>
</template>

<script>
import { fileUpload } from "@/utils/config";
import { filesGet } from "@/services/api/user/index";
import { formatTimestamp } from "@/utils/timezoneOffset";
import { filesDelete } from "@/services/api/user/index";
import { mapState } from "vuex";
export default {
  name: "activeFile",
  props: {
    userId: Number,
    required: true,
  },
  data() {
    return {
      fileUpload,
      fileList: [],
      loadFileParams: {
        user_id: this.userId,
      },
      loading: true,
    };
  },
  computed: {
    ...mapState({
      currentChat: (state) => state.chatIM.currentChat,
    }),
  },
  async mounted() {
    await this.filesGetData();
  },
  methods: {
    fileSend(file){
      // console.log(file);
      
      if (this.currentChat) {
        if (file.type === "image") {
          const content = {
          type: "image",
          data: {
            url: file.file,
          },
        };
        this.$store.dispatch("chatIM/setQuickMessage", content);
          console.log(content);
        } else {
          const content = {
          type: "document",
          data: {
            file: file.file,
            name: file.name,
            size: file.size
          },
        };
        this.$store.dispatch("chatIM/setQuickMessage", content);
          console.log(content);
        }
        
        
      } 
      else {
        this.$message({
          message: this.$t("selectDialog"),
          type: "warning",
        });
      }
    },
    deleteFileData(id) {
      filesDelete(id)
        .then(() => {
          this.filesGetData();
          this.$message({
            message: this.$t("deleteFileSuccess"),
            type: "success",
          });
        })
        .catch((error) => {
          console.error(error);
          this.$message({
            message: this.$t("deleteFileError"),
            type: "error",
          });
        });
    },
    filesGetData() {
      filesGet(this.userId)
        .then((res) => {
          this.fileList = res.data.map((item) => ({
            ...item,
            time: formatTimestamp(item.timestamp),
          }));
          // console.log(this.fileList);
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    uploadSuccess() {
      this.filesGetData();
      this.$message({
        message: this.$t("uploadFileSuccess"),
        type: "success",
      });
    },
    uploadError() {
      this.filesGetData();
      this.$message({
        message: this.$t("uploadFileError"),
        type: "error",
      });
    },
    beforeUpload(file) {
      // 检查文件大小
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        this.$message.error(this.$t("fileSizePrompt"));
        return false; // 阻止上传
      }
    },

    load() {},
  },
};
</script>

<style lang="scss" scoped>
@import "../activeFile/Index.scss";
</style>
