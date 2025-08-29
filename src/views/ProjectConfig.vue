<template>
  <div class="project-config">
    <h1>项目配置</h1>

    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <div class="left-section">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          新增项目
        </el-button>
      </div>

      <div class="right-section">
        <el-select v-model="searchType" placeholder="请选择" style="width: 120px">
          <el-option label="项目名称" value="projectName" />
          <el-option label="产品名称" value="productName" />
          <el-option label="产品ID" value="productId" />
        </el-select>

        <el-input
          v-model="searchKeyword"
          placeholder="请输入搜索内容"
          style="width: 200px; margin-left: 10px"
          @keyup.enter="handleSearch"
        />

        <el-button type="primary" @click="handleSearch" style="margin-left: 10px">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>
    </div>

    <!-- 项目列表表格 -->
    <el-table :data="projectList" style="width: 100%; margin-top: 20px" v-loading="loading">
      <el-table-column prop="projectName" label="项目名称" width="150" />

      <el-table-column prop="icon.fileUrl" label="项目Icon" width="100">
        <template #default="scope">
          <el-image
            :src="scope.row.icon.fileUrl"
            style="width: 40px; height: 40px"
            fit="cover"
            :preview-src-list="[scope.row.icon.fileUrl]"
          />
        </template>
      </el-table-column>

      <el-table-column prop="productName" label="产品名称" width="150" />
      <el-table-column prop="productId" label="产品ID" width="120" />
      <el-table-column prop="createdBy" label="创建人" width="100" />
      <el-table-column prop="createdTime" label="创建时间" width="180" />

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            circle
          >
            <el-icon><Setting /></el-icon>
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            circle
            style="margin-left: 8px"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <span class="total-info">共 {{ total }} 条</span>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑项目弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑项目' : '新增项目'"
      width="500px"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="form.projectName"
            placeholder="请输入项目名称"
            style="width: 300px"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item label="项目Icon" prop="projectIcon" required>
          <div class="upload-section">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              accept="image/*"
            >
              <div v-if="form.projectIcon" class="image-preview">
                <img :src="form.projectIcon" class="avatar" />
                <div class="image-overlay">
                  <el-icon><Plus /></el-icon>
                  <span>重新上传</span>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <span>上传本地文件</span>
              </div>
            </el-upload>
            <div class="upload-tip">只能上传图片文件</div>
          </div>
        </el-form-item>

        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="form.productName"
            placeholder="请输入产品名称"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="产品ID" prop="productId">
          <el-input
            v-model="form.productId"
            placeholder="请输入产品ID"
            style="width: 300px"
            :disabled="isEdit"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, Setting, Delete } from "@element-plus/icons-vue";
import { projectApi } from '@/api/project';

export default {
  name: "ProjectConfig",
  components: {
    Plus,
    Search,
    Setting,
    Delete,
  },
  setup() {
    // 响应式数据
    const loading = ref(false);
    const dialogVisible = ref(false);
    const isEdit = ref(false);
    const searchType = ref("projectName");
    const searchKeyword = ref("");
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const projectList = ref([]);

    // 表单数据（新增和编辑共用）
    const form = reactive({
      id: "",
      projectName: "",
      projectIcon: "",
      productName: "",
      productId: "",
    });

    // 表单验证规则
    const rules = {
      projectName: [
        { required: true, message: "请输入项目名称", trigger: "blur" },
      ],
      projectIcon: [
        { required: true, message: "请上传项目Icon", trigger: "change" },
      ],
      productName: [
        { required: true, message: "请输入产品名称", trigger: "blur" },
      ],
      productId: [
        { required: true, message: "请输入产品ID", trigger: "blur" },
      ],
    };

    // 方法
    const showAddDialog = () => {
      isEdit.value = false;
      dialogVisible.value = true;
      resetForm();
    };

    const handleEdit = (row) => {
      isEdit.value = true;
      dialogVisible.value = true;
      // 填充表单数据
      Object.assign(form, {
        id: row.id,
        projectName: row.projectName,
        projectIcon: row.icon.fileUrl, // 修改为icon.fileUrl
        productName: row.productName,
        productId: row.productId,
      });
    };

    const handleClose = () => {
      dialogVisible.value = false;
      resetForm();
    };

    const resetForm = () => {
      Object.keys(form).forEach((key) => {
        form[key] = "";
      });
      form.id = "";
    };

    const beforeAvatarUpload = (file) => {
      // 检查文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        ElMessage.error('只能上传图片文件!');
        return false;
      }

      // 检查文件大小（限制为2MB）
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        ElMessage.error('图片大小不能超过 2MB!');
        return false;
      }

      // 读取文件并预览
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        form.projectIcon = reader.result;
      };

      return false; // 阻止自动上传
    };

    const handleSubmit = async () => {
      try {
        if (isEdit.value) {
          // 编辑项目
          const response = await projectApi.updateProject(form.id, form);
          if (response.code === 200) {
            ElMessage.success('项目编辑成功');
            dialogVisible.value = false;
            loadData(); // 重新加载数据
            resetForm();
          }
        } else {
          // 新增项目
          const response = await projectApi.createProject(form);
          if (response.code === 200) {
            ElMessage.success('项目添加成功');
            dialogVisible.value = false;
            loadData(); // 重新加载数据
            resetForm();
          }
        }
      } catch (error) {
        ElMessage.error(isEdit.value ? '编辑失败' : '添加失败');
      }
    };

    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm("确定要删除这个项目吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        const response = await projectApi.deleteProject(row.id);
        if (response.code === 200) {
          ElMessage.success('删除成功');
          loadData(); // 重新加载数据
        }
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败');
        }
      }
    };

    const handleSearch = () => {
      currentPage.value = 1; // 搜索时重置到第一页
      loadData();
    };

    const handleSizeChange = (val) => {
      pageSize.value = val;
      currentPage.value = 1;
      loadData();
    };

    const handleCurrentChange = (val) => {
      currentPage.value = val;
      loadData();
    };

    // 加载数据 - 修改为使用POST方法传递查询对象
    const loadData = async () => {
      loading.value = true;
      try {
        // 构造查询条件，符合ProjectQueryDTO格式
        const queryDTO = {
          projectName: searchKeyword.value || '', // 项目名称搜索
          current: currentPage.value,
          size: pageSize.value
        };

        const response = await projectApi.getProjects(queryDTO);
        if (response.success) {
          projectList.value = response.data.records; // 使用records字段
          total.value = response.data.total;
          currentPage.value = response.data.current;
          pageSize.value = response.data.size;
        }
      } catch (error) {
        ElMessage.error('获取数据失败');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      loading,
      dialogVisible,
      isEdit,
      searchType,
      searchKeyword,
      currentPage,
      pageSize,
      total,
      form,
      rules,
      projectList,
      showAddDialog,
      handleEdit,
      handleClose,
      resetForm,
      beforeAvatarUpload,
      handleSubmit,
      handleDelete,
      handleSearch,
      handleSizeChange,
      handleCurrentChange,
    };
  },
};
</script>

<style scoped>
.project-config {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.top-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.left-section {
  display: flex;
  align-items: center;
}

.right-section {
  display: flex;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 20px;
}

.total-info {
  font-size: 14px;
  color: #606266;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 80px;
  height: 80px;
  display: block;
  border-radius: 4px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #8c939d;
}

.upload-placeholder .el-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.image-preview {
  position: relative;
  width: 80px;
  height: 80px;
}

.image-preview .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #606266;
  font-weight: 600;
}
</style>
