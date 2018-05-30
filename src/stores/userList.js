import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    getUserList: false,
    getUserListSuc: false,
    getUserListErr: false,
    userList: []
  },
  actions: {
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
  mutations: {
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
