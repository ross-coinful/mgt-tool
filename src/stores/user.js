import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    getUserList: false,
    getUserListSuc: false,
    getUserListErr: false,
    user: null,
    userList: []
  },
  actions: {
    getUser ({ commit }) {
      commit('getUser');

      ApiClient.GET('/user')
      .then((response) => {
        commit('getUserSuc', response);
      }, (error) => {
        commit('getUserErr', error);
      });
    },
    getUserList ({commit}) {
      commit('getUserList');

      ApiClient.GET(`/user/list`)
      .then((response) => {
        commit('getUserListSuc', response);
      }, (error) => {
        commit('getUserListErr', error);
      });
    }
  },
  getters: {
    userList: (state) => {

      if (state.userList.length) {
        return state.userList.filter((user) => user.id !== state.user.id);
      }
      return state.userList;
    }
  },
  mutations: {
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
    getUserList (state) {
      state.getUserList = true;
      state.getUserListSuc = false;
    },
    getUserListSuc (state, userList) {
      state.getUserList = false;
      state.getUserListSuc = true;
      state.userList = userList;
    },
    getUserListErr (state, err) {
      state.getUserList = false;
      state.getUserListErr = err;
    }
  }
};
