const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // 控制前端页面的地址和端口
  devServer: {
    port: 8082,           // 前端服务端口
    host: '0.0.0.0',      // 前端服务地址localhost
    // 指定允许的 host
    allowedHosts: [
      'selfwork.createflow-test.com',
      'localhost',
      '127.0.0.1',
      '192.168.192.1'
    ],
  },

  // 添加 Webpack 配置解决模块兼容性问题
  configureWebpack: {
    resolve: {
      fallback: {
        // 确保模块系统兼容性
        module: false,
        exports: false
      }
    },
    // 处理 ES6 模块兼容性
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  },

  // 确保 Element Plus 被正确转译
  transpileDependencies: [
    'element-plus',
    'normalize-wheel-es',
    /node_modules\/element-plus/
  ]
})
