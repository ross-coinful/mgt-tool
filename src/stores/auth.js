import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    loginSuc: false,
    logoutSuc: false,
    token: null
  },
  actions: {
    login ({ commit }, code) {
      commit('login');

      ApiClient.GET(`/auth/token/${code}`)
      .then((response) => {
        commit('loginSuc');
      }, (error) => {
        commit('loginErr', error);
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
  mutations: {
    login (state) {
      state.login = true;
    },
    loginSuc (state) {
      state.login = false;
      state.loginSuc = true;

      localStorage.setItem('isLogin', true);
    },
    loginErr (state, err) {
      state.login = false;
      state.loginErr = err;
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
