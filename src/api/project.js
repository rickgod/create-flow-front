import axios from 'axios'

// 根据环境自动选择 API 地址
const baseURL = process.env.VUE_APP_API_BASE_URL;

console.log('API 配置:', {
  env: process.env.VUE_APP_ENV,
  envName: process.env.VUE_APP_ENV_NAME,
  baseURL: baseURL
});

// 创建 axios 实例
const api = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    console.log(`[${process.env.VUE_APP_ENV_NAME}] 请求:`, config.url);
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log(`[${process.env.VUE_APP_ENV_NAME}] 响应:`, response.data);
    return response.data
  },
  error => {
    console.error(`[${process.env.VUE_APP_ENV_NAME}] 请求失败:`, error);
    return Promise.reject(error)
  }
)

export const projectApi = {
  // 查询项目列表 - 修改为POST方法，路径为/flow/project/query
  getProjects(queryDTO) {
    return api.post('/flow/project/query', queryDTO)
  },

  // 新增项目 - 修改为传递ProjectBO格式的数据
  createProject(projectBO) {
    return api.post('/flow/project/add', projectBO)
  },

  // 编辑项目 - 修改为传递ProjectBO格式的数据
  updateProject(projectBO) {
    return api.put('/flow/project/edit', projectBO)
  },

  // 删除项目 - 修改为传递id参数
  deleteProject(id) {
    return api.delete(`/flow/project/${id}`)
  }
}
