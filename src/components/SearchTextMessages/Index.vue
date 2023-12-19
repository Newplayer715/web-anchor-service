<template>
  <div class="searchTextMessages">
    <div class="messageItem" v-for="(item, index) in list" :key="index">
        <div class="item">
            <div class="leftArea">
            <el-avatar
            :src="item.sender.avatar"
            :size="30"
            ></el-avatar>
            <div class="contentArea">
                <div class="name">{{ item.sender.name }}</div>
                <div class="content">{{ renderMessage(item.content) }}</div>
            </div>
        </div>
        <div class="rightArea">{{ formatTime(item.send_at, 0) }}</div>
        </div>
        <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import { formatTimeText } from '@/utils/tools';

export default {
  name: 'searchTextMessages',
  props: {
    list: {
      type: Array,
      default: []
    },
  },
  mounted() {
  },
  data() {
    return {
       
    }
  },
  methods: {
        /**
     * 根据给定的时间和消息索引格式化时间。
     * @param {string} time - 需要格式化的时间戳字符串。
     * @param {number} index - 当前消息的索引。
     * @returns {string | null} 格式化的时间字符串或者null。
     */
     formatTime(time, index) {
      if (!time) return;
      if (index === 0) {
        // 如果当前消息是列表中的第一条（index === 0），直接返回格式化后的时间。
        return formatTimeText(time);
      } else {
        // dayjs比较当前消息时间和前一条消息时间的差异。时间差
        const preMessage = this.messages?.[index - 1];
        const diff = Math.abs(dayjs(time).diff(preMessage?.send_at, 'minutes'));
        if (diff >= 5) {
          // 间差大于或等于5分钟，则返回格式化后的时间
          return formatTimeText(time);
        } else {
          return null;
        }
      }
    },
    renderMessage(content){
        let message =  '';
        content.forEach(item => {
            if(item.type === 'text'){
                message += item.data.text;
            }else if(item.type === 'face'){
                message += item.data.code;
            }
        });
        return message;
    }
  },
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>
