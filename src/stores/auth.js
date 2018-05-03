import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    getTokenSuc: false,
    logoutSuc: false,
    token: null,
    user: null
  },
  actions: {
    getToken ({ commit }, code) {
      commit('getToken');

      ApiClient.GET(`/auth/token/${code}`)
      .then((response) => {
        commit('getTokenSuc', response);
      }, (error) => {
        commit('getTokenErr', error);
      });
    },
    getUser ({ commit }) {
      commit('getUser');
      const token = localStorage.getItem('token');
      console.log('token', token);

      ApiClient.GET('/auth/user', {
        params: {
          token
        }
      })
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
    getToken (state) {
      state.getToken = true;
    },
    getTokenSuc (state, token) {
      state.getToken = false;
      state.getTokenSuc = true;

      localStorage.setItem('token', token);
    },
    getTokenErr (state, err) {
      state.getToken = false;
      state.getTokenErr = err;
    },
    getUser (state) {
      state.getUser = true;
    },
    getUserSuc (state, user) {
      state.getUser = false;
      state.getUserSuc = true;
      console.log('user', user);
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

      localStorage.removeItem('token');
    },
    logoutErr (state, err) {
      state.logout = false;
      state.logoutErr = err;
    }
    // addUser (state) {
    //   state.addUser = true;
    // },
    // addUserSuc (state, user) {
    //   state.addUser = false;
    //   state.addUserSuc = true;
    // },
    // addUserErr (state, err) {
    //   state.addUser = false;
    //   state.addUserErr = err;
    // },
  }
};
