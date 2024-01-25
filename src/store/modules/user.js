import { loginAPI } from '@/api/user'
export default {
  namespaced : true,
  state: () => {
    return {
      token: ''
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
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
