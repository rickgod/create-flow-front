import Mock from 'mockjs'

console.log('Mock 配置加载中...');
console.log('当前环境变量:', {
  VUE_APP_ENV: process.env.VUE_APP_ENV,
  VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL
});

// 模拟数据库 - 在内存中存储数据，按ProjectVO格式
let projectDatabase = [
  {
    id: 1,
    projectName: "主宰世界",
    icon: {
      id: "icon1",
      fileName: "project-icon-1.png",
      fileUrl: "https://via.placeholder.com/40x40/409EFF/FFFFFF?text=主"
    },
    productId: "123",
    productName: "主宰世界",
    createdBy: "用户名",
    createdTime: "2025-01-01 00:00:00"
  },
  {
    id: 2,
    projectName: "勇者联盟",
    icon: {
      id: "icon2",
      fileName: "project-icon-2.png",
      fileUrl: "https://via.placeholder.com/40x40/67C23A/FFFFFF?text=勇"
    },
    productId: "456",
    productName: "勇者联盟2024",
    createdBy: "用户名",
    createdTime: "2025-01-01 00:00:00"
  },
  {
    id: 3,
    projectName: "曙光重临",
    icon: {
      id: "icon3",
      fileName: "project-icon-3.png",
      fileUrl: "https://via.placeholder.com/40x40/E6A23C/FFFFFF?text=曙"
    },
    productId: "789",
    productName: "曙光重临",
    createdBy: "用户名",
    createdTime: "2025-01-01 00:00:00"
  }
]

// 生成更多模拟数据
for (let i = 4; i <= 20; i++) {
  projectDatabase.push({
    id: i,
    projectName: Mock.mock('@ctitle(3, 5)'),
    icon: {
      id: `icon${i}`,
      fileName: `project-icon-${i}.png`,
      fileUrl: `https://via.placeholder.com/40x40/${Mock.mock('@hex')}/${Mock.mock('@hex')}?text=${Mock.mock('@ctitle(1)')}`
    },
    productId: Mock.mock('@string("number", 3)'),
    productName: Mock.mock('@ctitle(3, 6)'),
    createdBy: Mock.mock('@cname'),
    createdTime: Mock.mock('@datetime("yyyy-MM-dd HH:mm:ss")')
  })
}

// 设置延迟时间
Mock.setup({
  timeout: '100-300'
})

// 添加调试信息
console.log('Mock 配置开始，准备拦截以下路径:')
console.log('- POST /api/flow/project/query')
console.log('- POST /api/flow/project/add')
console.log('- PUT /api/flow/project/edit')
console.log('- DELETE /api/flow/project/:id')

// 获取项目列表（支持分页和搜索）- 修改为POST方法，路径为/flow/project/query
Mock.mock('/api/flow/project/query', 'post', (options) => {
  console.log('Mock 拦截到 POST 请求:', options.url)
  console.log('Mock 请求体:', options.body)

  const queryDTO = JSON.parse(options.body)
  console.log('查询条件:', queryDTO)

  let filteredData = [...projectDatabase]

  // 根据查询条件过滤
  if (queryDTO.projectName) {
    filteredData = filteredData.filter(item =>
      item.projectName.includes(queryDTO.projectName)
    )
  }

  // 分页处理（模拟Page对象）
  const current = queryDTO.current || 1
  const size = queryDTO.size || 10
  const start = (current - 1) * size
  const end = start + size
  const list = filteredData.slice(start, end)

  // 返回符合Result<Page<ProjectVO>>格式的数据
  return {
    code: 200,
    message: "操作成功",
    data: {
      records: list,           // Page对象的records字段
      total: filteredData.length,  // 总记录数
      size: size,              // 每页大小
      current: current,        // 当前页
      pages: Math.ceil(filteredData.length / size)  // 总页数
    },
    timestamp: new Date().toLocaleString(),
    success: true
  }
})

// 新增项目 - 修改路径为/flow/project/add
Mock.mock('/api/flow/project/add', 'post', (options) => {
  console.log('Mock 拦截到 POST 请求:', options.body)

  const newProject = JSON.parse(options.body)
  const id = projectDatabase.length + 1

  const project = {
    id,
    projectName: newProject.projectName,
    icon: {
      id: `icon${id}`,
      fileName: `project-icon-${id}.png`,
      fileUrl: newProject.projectIcon
    },
    productId: newProject.productId,
    productName: newProject.productName,
    createdBy: "当前用户",
    createdTime: new Date().toLocaleString()
  }

  projectDatabase.unshift(project) // 添加到开头

  return {
    code: 200,
    message: '添加成功',
    data: project
  }
})

// 编辑项目 - 修改路径为/flow/project/edit
Mock.mock('/api/flow/project/edit', 'put', (options) => {
  console.log('Mock 拦截到 PUT 请求:', options.url)
  console.log('PUT 请求体:', options.body)

  const updateData = JSON.parse(options.body)
  const id = updateData.id

  console.log('要编辑的项目ID:', id)
  console.log('更新数据:', updateData)

  const index = projectDatabase.findIndex(item => item.id === id)
  if (index !== -1) {
    // 更新数据，但保持项目名称和产品ID不变
    projectDatabase[index] = {
      ...projectDatabase[index],
      icon: {
        ...projectDatabase[index].icon,
        fileUrl: updateData.projectIcon
      },
      productName: updateData.productName
    }

    console.log('编辑成功，更新后的数据:', projectDatabase[index])

    return {
      code: 200,
      message: '编辑成功',
      data: projectDatabase[index]
    }
  } else {
    console.log('项目不存在，ID:', id)
    return {
      code: 404,
      message: '项目不存在',
      data: null
    }
  }
})

// 删除项目 - 修改路径为/flow/project/:id
Mock.mock('/api/flow/project/:id', 'delete', (options) => {
  console.log('Mock 拦截到 DELETE 请求:', options.url)

  // 从URL中提取ID
  const url = options.url
  const idMatch = url.match(/\/api\/flow\/project\/(\d+)/)
  if (!idMatch) {
    return {
      code: 400,
      message: '无效的项目ID',
      data: null
    }
  }
  const id = parseInt(idMatch[1])

  const index = projectDatabase.findIndex(item => item.id === id)
  if (index !== -1) {
    projectDatabase.splice(index, 1)
    return {
      code: 200,
      message: '删除成功',
      data: null
    }
  } else {
    return {
      code: 404,
      message: '项目不存在',
      data: null
    }
  }
})

console.log('Mock 配置加载完成，已配置以下接口:')
console.log('- POST /api/flow/project/query (获取项目列表)')
console.log('- POST /api/flow/project/add (新增项目)')
console.log('- PUT /api/flow/project/edit (编辑项目)')
console.log('- DELETE /api/flow/project/:id (删除项目)')
