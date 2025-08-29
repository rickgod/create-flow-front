import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 根据环境条件加载Mock
if (process.env.VUE_APP_ENV === 'local') {
  console.log('本地环境，加载Mock配置...')
  require('./mock/index.js')
} else {
  console.log('非本地环境，跳过Mock配置...')
}

// 环境信息
console.log('=== 环境信息 ===');
console.log('环境类型:', process.env.VUE_APP_ENV);
console.log('环境名称:', process.env.VUE_APP_ENV_NAME);
console.log('API 地址:', process.env.VUE_APP_API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('================');

// // 本地环境加载 Mock，必须在 axios 实例创建之前加载
// if (process.env.VUE_APP_ENV === 'local') {
//   console.log('本地环境，加载 Mock 数据');
//   // 同步加载 Mock，确保在 axios 实例创建之前加载
//   require('./mock/index.js');
//   console.log('Mock 加载完成');
// } else {
//   console.log('非本地环境，使用真实 API');
// }

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);

app.mount("#app");
