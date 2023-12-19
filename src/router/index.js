import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomeView",
    // redirect: "/ChatView", // 重定向到第一个子路由
    component: () => import("@/views/Home/HomeView.vue"),
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("@/views/Login/Login.vue"),
  },
];

let push = VueRouter.prototype.push;
let replace = VueRouter.prototype.replace;
//重写VueRouter.prototype原型对象的push|replace方法
VueRouter.prototype.push = function (location) {
  //调用push方法且篡改push方法内部this指向->vueRouter类的实例
  push.call(
    this,
    location,
    () => {},
    () => {}
  );
};
VueRouter.prototype.replace = function (location) {
  //调用push方法且篡改push方法内部this指向->vueRouter类的实例
  replace.apply(this, [location, () => {}, () => {}]);
};

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
