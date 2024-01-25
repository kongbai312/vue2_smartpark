import axios from 'axios';
import store from '@/store/index';
import router from  'vue-router'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/api',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    if(token){
      config.headers.Authorization = token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    //错误处理
    Message.error(error.response.data.msg)
    if (error.response.status === 401) {
      // 1. 清空用户数据
      store.commit('user/delToken')
      // 2. 跳转到登录
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
