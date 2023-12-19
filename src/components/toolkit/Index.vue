<!-- 工具包 -->
<template>
  <div class="toolkit">
    <div class="topM">
      <div class="top">
        <div
          class="controlStrips"
          v-for="(item, key) in controlStrip"
          :key="key"
        >
          <div
            class="controlStrip"
            :class="{ active: controlStripIndex === key }"
            @click="changeControlStrip(key)"
          >
            <div
              class="icon"
              :style="{ backgroundImage: 'url(' + item.icon + ')' }"
            ></div>
            <div class="title">{{ $t(item.name) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="toolkitContent">
      <speechCenter
        v-if="controlStripIndex === 0"
        :userId="userId"
      ></speechCenter>
      <activeFile v-if="controlStripIndex === 1" :userId="userId"></activeFile>
      <commonLink v-if="controlStripIndex === 2" :userId="userId"></commonLink>
      <repository v-if="controlStripIndex === 3" :userId="userId"></repository>
    </div>
  </div>
</template>

<script>
import speechCenter from "@/components/speechCenter/Index.vue";
import activeFile from "@/components/activeFile/Index.vue";
import commonLink from "@/components/commonLink/Index.vue";
import repository from "@/components/repository/Index.vue";
export default {
  name: "toolkitComponent",
  components: {
    speechCenter,
    activeFile,
    commonLink,
    repository,
  },
  data() {
    return {
      controlStrip: [
        {
          name: "discourseCenter",
          icon: require("@/assets/icons/speechCenter.svg"),
        },
        {
          name: "commonlyUsedFiles",
          icon: require("@/assets/icons/activeFile.svg"),
        },
        {
          name: "commonlyUsedLink",
          icon: require("@/assets/icons/commonLink.svg"),
        },
        {
          name: "knowledgeBase",
          icon: require("@/assets/icons/repository.svg"),
        },
      ],
      controlStripIndex: 0,
      userId: "",
    };
  },
  created() {
    this.userId = Number(localStorage.getItem("user_id"));
  },

  methods: {
    changeControlStrip(index) {
      this.controlStripIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../toolkit/Index.scss";
</style>
