import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    getCardDetail: false,
    getCardDetailSuc: false,
    getCardDetailErr: false,
    data: {}
  },
  actions: {
    getCardDetail ({ commit }, id) {
      commit('getCardDetail');

      ApiClient.GET(`/card/${id}`)
      .then((response) => {
        commit('getCardDetailSuc', response);
      }, (error) => {
        commit('getCardDetailErr', error);
      });
    }
  },
  mutations: {
    getCardDetail (state) {
      state.getCardDetail = true;
      state.getCardDetailSuc = false;
    },
    getCardDetailSuc (state, data) {
      state.getCardDetail = false;
      state.getCardDetailSuc = true;
      state.data = data;
    },
    getCardDetailErr (state, err) {
      state.getCardDetail = false;
      state.getCardDetailErr = err;
    }
  }
};
