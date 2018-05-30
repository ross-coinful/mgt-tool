import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    getRepoList: false,
    getRepoListSuc: false,
    getRepoListErr: false,
    data: {}
  },
  actions: {
    getRepoList ({commit}) {
      commit('getRepoList');

      ApiClient.GET(`/repo/list`)
      .then((response) => {
        commit('getRepoListSuc', response);
      }, (error) => {
        commit('getRepoListErr', error);
      });
    }
  },
  mutations: {
    getRepoList (state) {
      state.getRepoList = true;
      state.getRepoListSuc = false;
    },
    getRepoListSuc (state, data) {
      state.getRepoList = false;
      state.getRepoListSuc = true;
      state.data = data;
    },
    getRepoListErr (state, err) {
      state.getRepoList = false;
      state.getRepoListErr = err;
    }
  }
};
