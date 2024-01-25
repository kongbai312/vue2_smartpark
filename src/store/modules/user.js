import { loginAPI } from '@/api/user'
export default {
  namespaced : true,
  state: () => {
    return {
      token: '',
      userInfo:{
        username:'',
        password:''
      }
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    delToken(state) {
      state.token = ''
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    delUserInfo(state) {
      state.userInfo = {
        username:'',
        password:''
      }
    }
  },
  actions: {
    //登录
    async loginAction({commit},{username,password}){
      let result = await loginAPI({ username, password })
      commit('setToken', result.data.token)
    }
  }
}
