import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    loginSuc: false,
    logoutSuc: false,
    token: null,
    user: null
  },
  actions: {
    login ({ commit }, code) {
      commit('login');

      ApiClient.GET(`/auth/token/${code}`)
      .then((response) => {
        commit('loginSuc', response);
      }, (error) => {
        commit('loginErr', error);
      });
    },
    getUser ({ commit }) {
      commit('getUser');

      ApiClient.GET('/user')
      .then((response) => {
        commit('getUserSuc', response);
      }, (error) => {
        commit('getUserErr', error);
      });
    },
    logout ({ commit }) {
      commit('logout');

      ApiClient.GET('/auth/logout')
      .then((response) => {
        commit('logoutSuc', response);
      }, (error) => {
        commit('logoutErr', error);
      });
    }
  },
  getters: {
  },
  mutations: {
    login (state) {
      state.login = true;
    },
    loginSuc (state, user) {
      state.login = false;
      state.loginSuc = true;
      state.user = user;

      console.log('user', user);
      localStorage.setItem('isLogin', true);
    },
    loginErr (state, err) {
      state.login = false;
      state.loginErr = err;
    },
    getUser (state) {
      state.getUser = true;
    },
    getUserSuc (state, user) {
      state.getUser = false;
      state.getUserSuc = true;
      state.user = user;
    },
    getUserErr (state, err) {
      state.getUser = false;
      state.getUserErr = err;
    },
    logout (state) {
      state.logout = true;
      state.user = null;
    },
    logoutSuc (state, user) {
      state.logout = false;
      state.logoutSuc = true;

      localStorage.removeItem('isLogin');
    },
    logoutErr (state, err) {
      state.logout = false;
      state.logoutErr = err;
    }
  }
};
