import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes.js';
import store from '@/store'
Vue.use(Router)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

//白名单
const WHITE_LIST = ['/login', '/404']
//路由前置守卫
router.beforeEach((to , from ,next) => {
  //引入token
  const token = store.state.user.token
  if(!!token){//已登录
    if(to.path==='/login'){//登录了还要去登录页
      next('/')
    }else {
      next()
    }
  }
  else{//未登录
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
