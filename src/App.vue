<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { getToken } from "@/utils/authCookie";
import { mapState, mapActions } from "vuex";
import { getCommunicationChannel } from "@/services/api/im";
const TOKEN_KEY = "client_token";

export default {
  async mounted() {
    if (getToken(TOKEN_KEY) && Object.keys(this.chatWSObj).length === 0) {
      await this.initChatWS();
    }
  },
  computed: {
    ...mapState({
      chatWSObj: (state) => state.chatWS.chatWSObj,
    }),
  },
  methods: {
    ...mapActions("chatWS", [
      "createChatWS",
      "disconnectChatWS",
    ]),
    // 获取聊天websocket连接地址
    async initChatWS() {
      const res = await getCommunicationChannel();
      const { data, statusCode, statusText } = res || {};
      if (statusCode === 200) {
        const {
          link,
          heartbeat_interval: heartbeatInterval,
          ack_nbits: ackNbits,
          heartbeat_tolerance: heartbeatTolerance,
          max_reconnect_times: maxReconnectTimes,
          ack_interval: ackInterval,
        } = data || {};
        // 已登陆，连接聊天ws
        this.createChatWS({
          url: link,
          options: {
            heartbeatInterval,
            ackNbits,
            heartbeatTolerance,
            maxReconnectTimes,
            ackInterval,
          },
        });
      } else {
        console.log(statusText);
      }
    },
  },
};
</script>

<style lang="scss"></style>
