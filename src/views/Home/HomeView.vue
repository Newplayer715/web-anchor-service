<template>
  <div class="HomeView">
    <!-- 外层容器 -->
    <el-container>
      <!-- 顶部栏容器 -->
      <el-header height="70px">
        <el-row >
          <el-col :span="4" class="LoginM">
            <div class="Logo"></div>
          </el-col>
          <el-col :span="8" :offset="12">
            <userInfo @userSave="handleUserSave"></userInfo>
          </el-col>
        </el-row>
        
      </el-header>
      <!-- 主要区域容器 -->
      <el-main>
        <el-row class="Main">
          <el-col :span="11">
            <div class="videoRoom">
              <videoRoom ref="childBRef"></videoRoom>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="squareRoom"></div>
          </el-col>
          <el-col :span="8">
            <div class="toolkit">
              <toolkit></toolkit>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import videoRoom from "@/components/videoRoom/Index.vue"
import userInfo from "@/components/userInfo/Index.vue";
import toolkit from "@/components/toolkit/Index.vue";
export default {
  name: "HomeView",
  components: {
    userInfo,
    toolkit,
    videoRoom
  },
  methods:{
    handleUserSave(){
      this.$refs.childBRef.getLiveData();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../Home/HomeView.scss";
</style>
