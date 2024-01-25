<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="id ? '编辑月卡' : '增加月卡'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carInfoFormRef" :model="carInfoForm" :rules="carInfoRules" label-width="100px">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeFormRef" :model="feeForm" :rules="feeFormRules" label-width="100px">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker v-model="feeForm.payTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" :picker-options="pickerOptions" />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option v-for="item in payMethodList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { validateCarNumber, validMobileRule } from '@/utils/validate';
import { createCardAPI, getCardDetailAPI } from '@/api/card'
export default {
  data() {
    return {
      // 车辆信息表单
      carInfoForm: {
        personName: '啊', // 车主姓名
        phoneNumber: '13760100000', // 联系方式
        carNumber: '粤B11111', // 车牌号码
        carBrand: '1' // 车辆品牌
      },
      //校验规则
      carInfoRules: {
        //车主姓名校验
        personName: [
          {
            required: true, message: '请输入车主姓名', trigger: 'blur'
          }
        ],

        //手机号校验
        phoneNumber: [
          {
            required: true, message: '请输入联系方式', trigger: 'blur'
          },
          {
            validator: validMobileRule, trigger: 'blur'
          }
        ],

        //车牌号校验
        carNumber: [
          {
            required: true, message: '请输入车辆号码', trigger: 'blur'
          },
          {
            validator: validateCarNumber, trigger: 'blur'
          }
        ],

        //车辆品牌校验
        carBrand: [
          {
            required: true, message: '请输入车辆品牌', trigger: 'blur'
          }
        ]
      },

      // 缴费信息表单
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: null, // 支付金额
        paymentMethod: '' // 支付方式
      },
      // 缴费规则
      feeFormRules: {
        payTime: [
          {
            required: true,
            message: '请选择支付时间'
          }
        ],
        paymentAmount: [
          {
            required: true,
            message: '请输入支付金额',
            trigger: 'blur'
          }
        ],
        paymentMethod: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }
        ]
      },
      // 支付方式列表
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ],

      //日期
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000;//  - 86400000是否包括当天
        }
      },
    }
  },

  methods: {
    //点击确定
    confirmAdd() {
      this.$refs.carInfoFormRef.validate(valid => {
        if (valid) {
          this.$refs.feeFormRef.validate(async valid => {
            if (valid) {
              // 全部校验通过
              // TODO 确定
              // 参数处理
              const payload = {
                ...this.feeForm,
                ...this.carInfoForm,
                // 单独处理时间
                cardStartDate: this.feeForm.payTime[0],
                cardEndDate: this.feeForm.payTime[1]
              }
              // 删掉多余字段
              delete payload.payTime
              if (this.id) {
                // 编辑
                await updateCardAPI(payload)
              } else {
                // 新增
                await createCardAPI(payload)
              }
              this.$message.success(id ? '修改成功' : '新增成功')
              this.$router.back()
            }
          })
        }
      })
    },

    // 重置表单
    resetForm() {
      this.$refs.feeFormRef.resetFields()
      this.$refs.carInfoFormRef.resetFields()
    },

    // 获取详情
    async getDetail() {
      const res = await getCardDetailAPI(this.id)
      // 回填车辆信息表单
      const { carInfoId, personName, phoneNumber, carNumber, carBrand } = res.data
      this.carInfoForm = {
        personName, phoneNumber, carNumber, carBrand, carInfoId
      }

      // 回填缴费信息表单
      const { rechargeId, cardStartDate, cardEndDate, paymentAmount, paymentMethod } = res.data
      this.feeForm = {
        rechargeId,
        paymentAmount,
        paymentMethod,
        payTime: [cardStartDate, cardEndDate]
      }
    }

  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    if (this.id) {
      this.getDetail()
    }
  }

}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }

    .preview {
      img {
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
