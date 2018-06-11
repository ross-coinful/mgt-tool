import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    getCard: false,
    getCardSuc: false,
    getCardErr: false,
    data: {}
  },
  actions: {
    getCard ({ commit, rootState }) {
      commit('getCard');

      const mapId = rootState.map.map.id;
      const cardId = rootState.card.focusId;

      ApiClient.GET(`/map/${mapId}/card/${cardId}`)
      .then((response) => {
        commit('getCardSuc', response);
      }, (error) => {
        commit('getCardErr', error);
      });
    }
  },
  mutations: {
    getCard (state) {
      state.getCard = true;
      state.getCardSuc = false;
    },
    getCardSuc (state, data) {
      state.getCard = false;
      state.getCardSuc = true;
      state.data = data;
    },
    getCardErr (state, err) {
      state.getCard = false;
      state.getCardErr = err;
    }
  }
};
