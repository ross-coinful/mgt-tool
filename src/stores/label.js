// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';

export default {
  state: {
    labelList: []
  },
  actions: {
    getLabelList ({ commit }) {
      commit('getLabelList');

      axios({
        method: 'get',
        url: `${localServer}/label/list`
      })
      .then((response) => {
        commit('getLabelListSuc', response.data);
      }, (error) => {
        commit('getLabelListErr', error);
      });
    }
  },
  getters: {
    labelList: state => state.labelList,
    label: (state) => (id) => {
      return state.labelList.find(label => label.id === id);
    }
  },
  mutations: {
    getLabelList (state) {
      state.getLabelList = true;
    },
    getLabelListSuc (state, list) {
      state.getLabelList = false;
      state.getLabelListSuc = true;
      state.labelList = list;
    },
    getLabelListErr (state, err) {
      state.getLabelList = false;
      state.getLabelListErr = err;
    }
  }
};
