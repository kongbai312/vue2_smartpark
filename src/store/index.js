import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import createPersistedstate from "vuex-persistedstate";
Vue.use(Vuex);

const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    user,
  },
  plugins: [
    createPersistedstate({
      //key是存储数据的键名
      key: "vue2-smartpark", //paths是存储state中的那些数据，如果是模块下具体的数据需要加上模块名称，如user.token
      paths: ["user"],
    }),
  ],
});

export default store;
