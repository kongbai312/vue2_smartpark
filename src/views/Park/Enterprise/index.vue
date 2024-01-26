<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEnterprise">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="enterpriseList" @expand-change="expandHandle">
        <!-- 合同列表 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-table :data="row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起止时间">
                <template #default="scope">
                  <span >
                    {{ scope.row.startTime }}至{{ scope.row.endTime }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="合同状态">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" type="text">续租</el-button>
                  <el-button size="mini" type="text">退租</el-button>
                  <el-button size="mini" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editRent(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination @current-change="pageChange" layout="total, prev, pager, next" :total="total"
        :page-size="params.pageSize" />
    </div>
    <!-- 合同 -->
    <el-dialog title="添加合同" :visible="rentDialogVisible" width="580px" @close="closeDialog">
      <!-- 表单区域 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option v-for="item in buildList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker v-model="rentForm.rentTime" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload action="#" :http-request="uploadHandle" :before-upload="beforeUpload" :limit="1"
              :on-exceed="onExceed" :on-remove="onRemove">
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getEnterpriseListAPI, delEnterpriseAPI, getRentBuildListAPI, uploadAPI, createRentAPI, getRentListAPI } from '@/api/enterprise'
export default {
  name: 'Building',
  data() {
    return {
      //企业列表
      enterpriseList: [],
      //请求参数
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      },
      //企业总数
      total: 0,
      //控制合同显示隐藏
      rentDialogVisible: false,
      //合同表单
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      //合同校验规则
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件', trigger: 'change' }
        ]
      },
      buildList: []//楼宇列表
    }
  },
  mounted() {
    this.getEnterpriseList()
  },
  methods: {
    //获取企业列表
    async getEnterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      //处理数据，每个企业都添加个放合同的列表
      this.enterpriseList = res.data.rows.map((item) => {
        return {
          ...item,
          rentList: [] // 每一行补充存放合同的列表
        }
      })
      this.total = res.data.total
    },

    //查询企业
    search() {
      this.params.page = 1
      this.getEnterpriseList()
    },

    //添加企业
    addEnterprise() {
      this.$router.push('/enterpriseAdd')
    },

    //编辑企业
    editRent(id) {
      this.$router.push(`/enterpriseAdd?id=${id}`)
    },

    //删除企业
    async delEnterprise(id) {
      try {
        await this.$confirm('确认删除该企业吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let result = await delEnterpriseAPI(id)
        //如果该页只有一条数据，且不在第一页，返回到上一页
        if (this.enterpriseList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        //刷新数据
        this.getEnterpriseList()
        //提示
        if (result.code === 50000) {
          this.$message.warning(result.msg)
        }
        else {
          //成功提示
          this.$message.success('删除成功')
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 打开合同弹窗
    async addRent(id) {
      this.rentDialogVisible = true
      // 把企业id存入表单对象
      this.rentForm.enterpriseId = id
      // 获取楼宇下拉列表
      const res = await getRentBuildListAPI()
      this.buildList = res.data
    },

    // 关闭合同弹窗
    closeDialog() {
      this.rentDialogVisible = false
      this.$refs.addForm.resetFields()
      this.rentForm = {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      }
      //清空上传后的文件
      this.$refs.upload.clearFiles()
    },

    //展开合同
    async expandHandle(row, rows) {//row为点击展开的列表，rows为全部展开的列表
      //找到对应展开的列表
      const isExpend = rows.find(item => item.id === row.id)
      if (isExpend) {
        const res = await getRentListAPI(row.id)
        row.rentList = res.data
      }
    },

    // 文件超过限制
    onExceed() {
      this.$message.warning('文件上传个数 超出限制')
    },
    // 上传前的校验
    beforeUpload(file) {
      //文件类型
      const typeList = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf'
      ]
      //是否是类型内
      const fileType = typeList.includes(file.type)
      //大小限制
      const isLt5M = file.size / 1024 / 1024 < 5
      if (fileType && isLt5M) {
        return true
      } else {
        this.$message.warning('上传文件不符合要求，请重新上传')
        return false
      }
    },

    //移除文件
    onRemove() {
      this.rentForm.contractId = ''
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    },

    // 上传合同
    async uploadHandle(fileData) {
      // 1. 处理FormData
      const file = fileData.file
      const formData = new FormData()
      //文件，后端定义
      formData.append('file', file)
      //类型，后端定义
      formData.append('type', 'contract')
      // 2. 上传并赋值
      const res = await uploadAPI(formData)
      const { id, url } = res.data
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url
      //校验去除提示
      this.$refs.addForm.validateField('contractId')
    },

    //确定提交
    confirmAdd() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        const { buildingId, contractId, contractUrl, enterpriseId, type } = this.rentForm
        await createRentAPI({
          buildingId, contractId, contractUrl, enterpriseId, type,
          startTime: this.rentForm.rentTime[0],
          endTime: this.rentForm.rentTime[1]
        })
        // 更新列表
        this.getEnterpriseList()
        // 关闭弹框
        this.closeDialog()
      })
    },

    //页码更改
    pageChange(page) {
      // 更改参数
      this.params.page = page
      // 重新获取数据渲染
      this.getEnterpriseList()
    },

    //序号格式处理，第二页的序号能接上第一页
    indexMethod(row) {
      return (this.params.page - 1) * this.params.pageSize + 1 + row
    },

    // 格式化tag类型
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },

    // 格式化status
    formatStatus(type) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[type]
    }
  }
}
</script>
<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
