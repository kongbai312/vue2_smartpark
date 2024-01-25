<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="loginForm.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="remember">记住我</el-checkbox>
          <el-button @click="addUser" size="small" style="margin-left: 10px;">添加</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data(){
    return{
      //登录表单
      loginForm:{
        username:'',
        password:''
      },
      //校验规则
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      //是否记住用户
      remember:false
    }
  },
  mounted(){
    //读取本地用户信息
    const userInfo = this.$store.state.user.userInfo
    //本地有信息
    if(userInfo.username !== ''){//直接读取本地
      this.loginForm = userInfo
    }
  },
  methods:{
    //登录
    login(){
      //表单整体校验
      this.$refs.form.validate(async( valid ) => {
        if(valid){//校验成功
          const { username, password } = this.loginForm
          await this.$store.dispatch('user/loginAction', { username, password })
          this.$message.success('登录成功')
          //是否记住用户
          if(this.remember){//记住
            this.$store.commit('user/setUserInfo',this.loginForm)
          }
          else{
            this.$store.commit('user/delUserInfo')
          }
          //跳转
          this.$router.push(this.$route.query.redirect ? this.$route.query.redirect : '/')
        }
      })
    },
    //方便写代码
    addUser(){
      this.loginForm = {
        username:'demo',
        password:'zh@hm#23'
      }
    }
  }
}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
