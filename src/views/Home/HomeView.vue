<template>
  <div class="HomeView">
    <!-- 外层容器 -->
    <el-container>
      <!-- 侧边栏容器 -->
      <el-aside width="104px">
        <div class="menuLists">
          <div
            class="menuList"
            :class="{ active: $route.path === '/ChatView' }"
          >
            <router-link to="/ChatView" class="link">
              <div class="chatMenu">
                <el-icon class="menuIcon" name="s-comment"></el-icon>
              </div>
            </router-link>
          </div>
          <div
            class="menuList"
            :class="{ active: $route.path === '/AddressBook' }"
          >
            <router-link to="/AddressBook" class="link">
              <div class="contactMenu">
                <el-icon class="menuIcon" name="s-custom"></el-icon>
              </div>
            </router-link>
          </div>
        </div>
      </el-aside>
      <!-- 主要区域容器 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style lang="scss" scoped>
@import "../Home/HomeView.scss";
</style>
