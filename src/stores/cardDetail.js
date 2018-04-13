// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';

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

      axios({
        method: 'get',
        url: `${localServer}/card/${id}`
      })
      .then((response) => {
        commit('getCardDetailSuc', response.data);
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
