<template>
  <div class="emotion-box">
    <div v-for="(line, i) in list" :key="i">
      <span
        class="emotion-item"
        v-for="(item, j) in line"
        :key="j"
        @click="clickHandler(item)"
        >{{ item }}</span
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "EmojiCom",
  props: ["height", "hasLimit"],
  data() {
    return {
      list: [
        [
          "😀",
          "😄",
          "😅",
          "🤣",
          "😂",
          "😉",
          "😊",
          "😍",
          "😘",
          "😜",
          "😝",
          "😏",
          "😒",
          "🙄",
          "😔",
          "😴",
          "😷",
          "🤮",
          "🥵",
          "😎",
          "😮",
          "😰",
          "😭",
          "😱",
          "😩",
          "😡",
          "💀",
          "👽",
          "🤓",
          "🥳",
          "😺",
          "😹",
          "😻",
          "🤚",
          "💩",
          "👍",
          "👎",
          "👏",
          "🙏",
          "💪",
          "🙈",
          "🙉",
          "🙊",
          "💥",
          "💫",
          "💦",
          "💨",
          "🐵",
          "🐒",
          "🦍",
          "🦧",
          "🐶",
          "🐕",
          "🦮",
          "🐕‍🦺",
          "🐩",
          "🐺",
          "🦊",
          "🦝",
          "🐱",
          "🐈",
          "🦁",
          "🐯",
        ], //emoji列表,可以往后继续加
      ],
    };
  },
  methods: {
    clickHandler(i) {
      this.$emit("emotion", i);
    },
  },
};
</script>

<style scoped>
.emotion-box {
  font-size: 20px;
  height: 200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  overflow: hidden;
  overflow-y: auto;
}

.emotion-box::-webkit-scrollbar {
  width: 5px;
  height: 3px !important;
  background-color: rgba(255, 255, 255, 0.1);
}

/* 定义滑块 内阴影+圆角 */
.emotion-box::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.emotion-item {
  width: 18px;
  text-align: center;
  cursor: pointer;
  margin: 5px;
}

.emotion-item:hover {
  background-color: #f1eff6;
  transition: transform 0.3s ease;
  transform: scale(1.3);
}
</style>
