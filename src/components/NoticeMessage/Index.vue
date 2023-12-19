<template>
  <div class="noticeMessage">
    <div class="name">{{ name }}</div>
    <div class="messageText">{{ renderText }}</div>
  </div>
</template>
<script>
export default {
  name: "NoticeMessage",
  props: {
    message: Object,
  },
  data() {
    return {
      type: "",
      data: {},
      name: "",
    };
  },
  mounted() {
    const { data, type } = this.message || {};
    this.type = type;
    this.data = data;
    this.getName();
  },
  computed: {
    renderText: function () {
      let text = "";
      switch (this.type) {
        case "friend_add":
          text = "已经是你的好友了";
          break;
        case "friend_recall":
          text = "撤回了一条消息";
          break;
        case "group_recall":
          text =
            this.data.user_id === this.data.operator_id
              ? "撤回了一条消息"
              : "被管理员撤回了一条消息";
          break;
        case "group_increase":
          text = "加入了群组";
          break;
        case "group_decrease":
          text =
            this.data.user_id === this.data.operator_id
              ? "退出了群组"
              : "被管理员移出了群组";
          break;
        case "group_ban":
          text = this.data?.sub_type === "ban" ? "被禁言了" : "被解除禁言了";
          break;
        default:
          break;
      }
      return text;
    },
  },
  methods: {
    getName() {
      if (this.type === "friend_add") {
        this.name = this.data.target_name;
      } else {
        this.name = this.data.user_name;
      }
      // switch (this.type) {
      //     case 'friend_add':
      //         this.name = this.data?.target_name;
      //         break;
      //     case 'friend_recall':
      //         this.name = this.data?.user_name;
      //         break;
      //     case 'group_recall':
      //         this.name = this.data?.user_name;
      //         break;
      //     case 'group_increase':
      //         this.name = this.data?.user_name;
      //         break;
      //     case 'group_decrease':
      //         this.name = this.data?.user_name;
      //         break;
      //     case 'group_ban':
      //         this.name = this.data?.user_name;
      //         break;
      //     default:
      //         break;
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Index.scss";
</style>
