import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    mapList: [],
    map: null
  },
  actions: {
    getMapList ({ commit }) {
      commit('getMapList');
      console.log('ApiClient', ApiClient);
      ApiClient.GET('/map/list')
      .then((response) => {
        commit('getMapListSuc', response);
      }, (error) => {
        commit('getMapListErr', error);
      });
    },
    getMap ({ commit }, id) {
      commit('getMap');

      ApiClient.GET('/map', {
        params: { id }
      }).then((map) => {
        commit('getMapSuc');
        commit('setCardList', map.cards);
        commit('setReleaseList', map.releases);
      }, (error) => {
        commit('getMapErr', error);
      });
    },
    addMap ({ commit }, data) {
      commit('addMap');

      ApiClient.POST('/map', {
        data
      }).then((id) => {
        data.id = id;
        data.cards = [];
        data.releases = [];

        commit('addMapSuc', data);
      }, (error) => {
        commit('addMapErr', error);
      });
    }
  },
  mutations: {
    getMapList (state) {
      state.getMapList = true;
    },
    getMapListSuc (state, list) {
      state.getMapList = false;
      state.getMapListSuc = true;
      state.mapList = list;
    },
    getMapListErr (state, err) {
      state.getMapList = false;
      state.getMapListErr = err;
    },
    getMap (state) {
      state.getMap = true;
    },
    getMapSuc (state) {
      state.getMap = false;
      state.getMapSuc = true;
    },
    getMapErr (state, err) {
      state.getMap = false;
      state.getMapErr = err;
    },
    addMap (state) {
      state.addMap = true;
    },
    addMapSuc (state, data) {
      const newMapList = state.mapList.slice();
      newMapList.push(data);

      state.mapList = newMapList;
      state.addMap = false;
      state.addMapSuc = true;
    },
    addMapErr (state, err) {
      state.addMap = false;
      state.addMapErr = err;
    }
  }
};
