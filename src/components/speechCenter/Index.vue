<template>
  <div class="speechCenter">
    <div class="center">
      <div class="title">{{ $t("discourseCenter") }}</div>
      <el-popover placement="bottom" width="270" trigger="click">
        <regionalLanguage @changeData="getData"></regionalLanguage>
        <div class="regionalSelection" slot="reference">
          <div class="right">
            <div
              class="iconfont icon-diqiu"
              style="font-size: 28px; color: #fff"
            ></div>
            <div class="title">{{ $t("regionSelection") }}</div>
          </div>
          <div
            class="iconfont icon-jiantouxiangxia"
            style="font-size: 28px; color: #fff; float: right"
          ></div>
        </div>
      </el-popover>
      <div class="currentArea">
        <div class="title">{{ $t("currentRegion") }}:</div>
        <div class="title">{{ country }}></div>
        <div class="title">{{ language }}</div>
      </div>
    </div>
    <div class="bottom" v-loading="loading">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(speechList, index) in speechLists"
          :key="index"
          :title="
            speechList.category_name + '(' + speechList.content.length + ')'
          "
          :name="index"
        >
          <div
            class="speechList"
            v-for="(item, key) in speechList.content"
            :key="key"
          >
            <div class="left">
              <div class="punctuation"></div>
              <div class="title">{{ item.content }}</div>
            </div>
            <div class="controls">
              <div
                class="iconfont icon-jijianfasong-xianxing"
                @click="speechSend(item)"
                style="font-size: 25px; color: #5868f3"
              ></div>
              <el-popconfirm
                :title="$t('deleteSpeechSkills')"
                @confirm="deleteSpeechData(item.id)"
                :confirm-button-text="$t('confirm')"
                :cancel-button-text="$t('cancel')"
              >
                <div
                  slot="reference"
                  class="iconfont icon-shanchu"
                  style="font-size: 25px; color: #f54a45; margin: 0 10px"
                ></div>
              </el-popconfirm>
              <div
                class="iconfont icon-fuzhi"
                style="font-size: 32px; color: #5868f3"
              ></div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="verbalManagement">
        <div class="verbalManagementBotton" @click="dialogTableVisible = true">
          <div class="title">{{ $t("discourseManagement") }}</div>
        </div>
      </div>
    </div>

    <!-- 话术管理弹窗 -->
    <el-dialog
      :title="$t('discourseManagement')"
      :visible.sync="dialogTableVisible"
      width="20%"
      :close-on-click-modal="false"
    >
      <div
        class="verbalLists"
        v-for="(item, index) in speechLists"
        :key="index"
      >
        <div class="title">
          {{ item.category_name }} ({{ item.content.length }})
        </div>
        <div class="operation">
          <div class="edit" @click="verbalEdit(item)">{{ $t("edit") }}</div>
          <div
            class="iconfont icon-shanchu"
            @click="deleteScriptsData(item)"
            style="font-size: 20px; color: #f54a45; margin-left: 20px"
          ></div>
        </div>
      </div>
      <div class="verbalAddButton" @click="dialogTableVisibleAdd = true">
        <div
          class="iconfont icon-xinzeng"
          style="font-size: 20px; color: #5868f3"
        ></div>
        <div class="title">{{ $t("addSpeechSkills") }}</div>
      </div>
    </el-dialog>

    <!-- 话术添加弹窗 -->
    <el-dialog
      :title="$t('addSpeechSkills')"
      :visible.sync="dialogTableVisibleAdd"
      width="20%"
      :close-on-click-modal="false"
    >
      <div class="classify">
        <div class="Mtitle">{{ $t("speechSkillsTitle") }}</div>
        <el-input
          v-model="addTitle"
          :placeholder="$t('title')"
          class="Input"
        ></el-input>
      </div>
      <div class="Add">
        <div class="Mtitle">{{ $t("add") }}{{ $t("speechSkills") }}</div>
        <el-input
          v-for="(inputItem, index) in inputArray"
          :key="index"
          v-model="inputItem.value"
          :placeholder="$t('speechSkills') + (index + 1)"
          class="Input"
        ></el-input>
        <div class="addButton" @click="addInput">
          <div
            class="iconfont icon-tianjia"
            style="color: #5868f3; font-size: 18px"
          ></div>
          <div class="title">{{ $t("add") }}</div>
        </div>
      </div>

      <div class="vcerbalAddition">
        <div class="back" @click="dialogTableVisibleAdd = false">
          {{ $t("back") }}
        </div>
        <div class="save" @click="addScriptsData">{{ $t("save") }}</div>
      </div>
    </el-dialog>

    <!-- 话术编辑弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="话术编辑"
      :visible.sync="dialogTableVisibleEdit"
      width="20%"
    >
      <div class="classify">
        <div class="Mtitle">{{ $t("speechSkillsTitle") }}</div>
        <el-input
          v-model="editTitle"
          :placeholder="$t('title')"
          class="Input"
        ></el-input>
      </div>
      <div class="Add">
        <div class="Mtitle">{{ $t("add") }}{{ $t("speechSkills") }}</div>
        <el-input
          v-for="(inputItem, index) in inputArrayEdit"
          :key="index"
          v-model="inputItem.value"
          :placeholder="$t('speechSkills') + (index + 1)"
          class="Input"
        ></el-input>
        <div class="addButton" @click="addEditInput">
          <div
            class="iconfont icon-tianjia"
            style="color: #5868f3; font-size: 18px"
          ></div>
          <div class="title">{{ $t("add") }}</div>
        </div>
      </div>

      <div class="vcerbalAddition">
        <div class="back" @click="dialogTableVisibleEdit = false">
          {{ $t("back") }}
        </div>
        <div class="save" @click="editSave">{{ $t("save") }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import regionalLanguage from "@/components/regionalLanguage/Index.vue";
import {
  getScripts,
  addScripts,
  deleteScripts,
  deleteScript,
} from "@/services/api/user/index";
import { mapState } from "vuex";
export default {
  components: { regionalLanguage },
  name: "speechCenter",
  props: {
    userId: Number,
    required: true,
  },
  data() {
    return {
      country: "",
      language: "",
      activeNames: [],
      greetingsNumber: 3,
      consultNumber: 3,
      commonProblemNumber: 3,
      speechLists: [],
      dialogTableVisible: false, //弹窗开关
      dialogTableVisibleAdd: false, //添加弹窗
      dialogTableVisibleEdit: false, //编辑弹窗
      // 初始化包含两个空字符串的数组
      inputArray: [{ value: "" }],
      inputArrayEdit: [{ value: "" }, { value: "" }],
      input: "",
      addTitle: "",
      editTitle: "",
      regionId: 0,
      loading: true,
      regions: [
        {
          country_id: 2,
          country_name: "中國香港",
          country_identifier: "Hong Kong",
          country_area_code: "852",
          language: [
            {
              language_id: 2,
              name: "繁体中文",
              abbreviation: "zh-hk",
            },
          ],
        },
        {
          country_id: 4,
          country_name: "Malaysia",
          country_identifier: "Malaysia",
          country_area_code: "60",
          language: [
            {
              language_id: 3,
              name: "English",
              abbreviation: "en",
            },
            {
              language_id: 1,
              name: "简体中文",
              abbreviation: "zh-cn",
            },
            {
              language_id: 5,
              name: "Melayu",
              abbreviation: "ms",
            },
          ],
        },
        {
          country_id: 3,
          country_name: "Việt Nam",
          country_identifier: "Vietnam",
          country_area_code: "84",
          language: [
            {
              language_id: 4,
              name: "Tiếng Việt",
              abbreviation: "vi",
            },
          ],
        },
      ], //地区和语言
    };
  },
  async mounted() {
    await this.getScriptsData();
    this.matchRegion();
  },
  computed: {
    ...mapState({
      currentChat: (state) => state.chatIM.currentChat,
    }),
  },
  methods: {
    matchRegion() {
      let country_id = "";
      let language_id = "";

      if (localStorage.getItem("country_id")) {
        country_id = Number(localStorage.getItem("country_id"));
        language_id = Number(localStorage.getItem("language_id"));
      } else {
        country_id = 4;
        language_id = 3; // 修正拼写错误
      }

      const regionsMatch = this.regions.find(
        (item) => item.country_id === country_id
      );
      if (regionsMatch) {
        this.country = regionsMatch.country_name;
        const languageMatch = regionsMatch.language.find(
          (item) => item.language_id === language_id
        );
        if (languageMatch) {
          this.language = languageMatch.name;
          // console.log(this.country, this.language);
        } else {
          console.error("Language not found for the given language_id.");
        }
      } else {
        console.error("Region not found for the given country_id.");
      }
    },
    // 话术发送
    speechSend(item) {
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
    verbalEdit(item) {
      console.log(item);
      this.editTitle = item.category_name;
      this.inputArrayEdit = item.content.map((scripts) => ({
        value: scripts.content,
      }));
      this.dialogTableVisibleEdit = true;
    },
    editSave() {},
    addEditInput() {
      this.inputArrayEdit.push({ value: "" });
    },
    addInput() {
      this.inputArray.push({ value: "" });
    },
    getData(country, languageName) {
      this.country = country.country_name;
      this.language = languageName;
      this.regionId = country.country_id;
      // console.log(country, this.regionId);
    },
    // 话术查询
    getScriptsData() {
      getScripts(this.userId, this.regionId)
        .then((res) => {
          this.speechLists = res.data.category;
          this.loading = false;
          // console.log(this.speechLists);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    //话术添加
    addScriptsData() {
      const user_id = this.userId;
      const region_id = this.regionId;
      const category_name = this.addTitle;
      const content = this.inputArray.map((item) => item.value);

      // console.log(data);
      addScripts(user_id, region_id, category_name, content)
        .then(() => {
          // console.log(res);
          this.getScriptsData();
          this.dialogTableVisibleAdd = false;
          this.$message({
            message: this.$t("addSpeechSkillsSuccess"),
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: this.$t("addSpeechSkillsError"),
            type: "error",
          });
          console.error(error);
        });
    },

    // 话术单条删除
    deleteSpeechData(id) {
      deleteScript(id)
        .then(() => {
          this.getScriptsData();
          this.$message({
            message: this.$t("deleteSpeechSkillsSuccess"),
            type: "success",
          });
        })
        .catch((error) => {
          console.error(error);
          this.$message({
            message: this.$t("deleteSpeechSkillsError"),
            type: "error",
          });
        });
    },
    // 话术批量删除
    deleteScriptsData(item) {
      this.$confirm(this.$t("deleteSpeechSkillsPrompt"), "Tips", {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          // console.log(item);
          deleteScripts(this.userId, this.regionId, item.category_name)
            .then(() => {
              this.getScriptsData();
              this.$message({
                message: this.$t("deleteSpeechSkillsSuccess"),
                type: "success",
              });
            })
            .catch((error) => {
              console.error(error);
              this.$message({
                message: this.$t("deleteSpeechSkillsError"),
                type: "error",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("cancelDelete"),
          });
        });
    },
    // console.log(item);
  },
};
</script>

<style lang="scss" scoped>
@import "../speechCenter/Index.scss";
</style>
