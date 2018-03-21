// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';

export default {
  state: {
    focusId: null,
    isOpen: false,
    isCreate: false,
    cardList: [],
    card: []
  },
  actions: {
    setFocusId ({ commit }, id) {
      commit('setFocusId', id);
    },
    openCard ({ commit }) {
      commit('openCard');
    },
    getCardList ({ commit }) {

      // apiClient.get('/card/list', {
      //   types: ['getList', 'getListSuc', 'getListErr'],
      //   commit
      // });

      commit('getList');

      axios({
        method: 'get',
        url: `${localServer}/card/list`
      })
      .then((response) => {
        commit('getListSuc', response.data);
      }, (error) => {
        commit('getListErr', error);
      });

    },
    getCard ({ commit }, id) {
      commit('getCard', id);
    }
  },
  getters: {
    activityCardIds: (state) => {
      return state.cardList.filter(card => card.type === 'activity').map(card => card.id);
    },
    activityCard: (state) => (id, index) => {
      return state.cardList.find(card => card.id === id && card.activityIndex === index);
    },
    taskCardIds: (state) => (index) => {
      return state.cardList.filter(card => card.type === 'task' && card.activityIndex === index).map(card => card.id);
    },
    taskCard: (state) => (id) => {
      return state.cardList.find(card => card.id === id);
    },
    subtaskCardIds: (state) => (activityIndex, releaseIndex, taskIndex) => {
      return state.cardList.filter(card => card.type === 'subtask' &&
        card.activityIndex === activityIndex &&
        card.releaseIndex === releaseIndex &&
        card.taskIndex === taskIndex).map(card => card.id);
    }
  },
  mutations: {
    setFocusId (state, id) {
      state.focusId = id;
    },
    openCard (state) {
      state.isOpen = true;
    },
    getList (state, id) {
      state.getList = true;
    },
    getListSuc (state, list) {
      state.getList = false;
      state.getListSuc = true;
      state.cardList = list;
    },
    getListErr (state, err) {
      state.getList = false;
      state.getListErr = err;
    }
  }
};
