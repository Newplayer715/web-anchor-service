const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://192.168.1.225:8000",
  //       changeOrigin: true,
  //       pathRewrite: {
  //         "^/api": "",
  //       },
  //     },
  //   },
  // },
});
