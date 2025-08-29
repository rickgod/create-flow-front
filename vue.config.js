const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  // 控制前端页面的地址和端口
  devServer: {
    port: 8082,           // 前端服务端口
    host: 'localhost',     // 前端服务地址
  }
})
