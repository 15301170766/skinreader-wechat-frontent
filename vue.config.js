module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/weixin/" : "/",
  devServer: {
    proxy: {
      "/sns": {
        target: "https://api.weixin.qq.com/sns",
        pathRewrite: {
          "^/sns": "", //重写接口
        },
        changeOrigin: true, //是否跨域
      },
    },
    disableHostCheck: true,
  },
};
