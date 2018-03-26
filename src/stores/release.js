// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';

export default {
  state: {
    releaseList: []
  },
  actions: {
    getReleaseList ({ commit }) {
      commit('getReleaseList');

      axios({
        method: 'get',
        url: `${localServer}/release/list`
      })
      .then((response) => {
        commit('getReleaseListSuc', response.data);
      }, (error) => {
        commit('getReleaseListErr', error);
      });
    }
  },
  getters: {
    releaseList: state => state.releaseList
  },
  mutations: {
    getReleaseList (state) {
      state.getReleaseList = true;
    },
    getReleaseListSuc (state, list) {
      state.getReleaseList = false;
      state.getReleaseListSuc = true;
      state.releaseList = list.sort((a, b) => a.order - b.order);
    },
    getReleaseListErr (state, err) {
      state.getReleaseList = false;
      state.getReleaseListErr = err;
    }
  }
};
