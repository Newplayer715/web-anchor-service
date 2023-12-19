<template>
  <div>
    <span v-for="(element, index) in renderedMessage" :key="index">
      <span v-if="element.type === 'text'">{{ element.content }}</span>
      <span v-if="element.type === 'face'">{{ element.content }}</span>

      <el-image
        class="imageMessage"
        v-else-if="element.type === 'image'"
        :src="element.content"
        alt="image"
        :preview-src-list="[element.content]"
      >
      </el-image>
    </span>
  </div>
</template>

<script>
export default {
  name: "messageContent",
  props: {
    content: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      srcList: [],
    };
  },
  computed: {
    renderedMessage() {
      if (this.content.length === 0) return [];
      let elements = [];
      this.content.map((item) => {
        const { type, data } = item;
        switch (type) {
          case "text":
            elements.push({ type: "text", content: data?.text || "" });
            break;
          case "face":
            elements.push({ type: "face", content: data?.code });
            break;
          case "image":
            elements.push({ type: "image", content: data?.url });
            break;
        }
      });
      return elements;
    },
  },
};
</script>
<style scoped>
.imageMessage {
  width: 300px;
}
</style>
