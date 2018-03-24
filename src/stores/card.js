// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';

export default {
  state: {
    focusId: null,
    isOpen: false,
    cardList: [],
    boardWidths: [],
    createCard: false,
    createIndexs: {}
  },
  actions: {
    setFocusId ({ commit }, id) {
      commit('setFocusId', id);
    },
    openCard ({ commit }) {
      commit('openCard');
    },
    getCardList ({ commit }) {
      commit('getCardList');

      axios({
        method: 'get',
        url: `${localServer}/card/list`
      })
      .then((response) => {
        commit('getCardListSuc', response.data);
      }, (error) => {
        commit('getCardListErr', error);
      });
    },
    getCard ({ commit }, id) {
      commit('getCard', id);
    },
    createCard ({ commit }, data) {
      commit('createCard', data);
    },
    addCard ({ commit, state }, title) {
      commit('addCard');

      const { createType, createIndexs } = state;
      const data = Object.assign({}, createIndexs);
      data.type = createType;
      data.title = title;

      if (createType === 'subtask') {
        data.label = 'todo';
      }

      axios({
        method: 'post',
        url: `${localServer}/card`,
        data
      })
      .then((response) => {
        data.id = response.data;

        commit('addCardSuc', data);
      }, (error) => {
        commit('addCardErr', error);
      });
    },
    updateCard ({ commit }, { id, data }) {
      commit('updateCard');

      axios({
        method: 'patch',
        url: `${localServer}/card/${id}`,
        data
      })
      .then((response) => {
        commit('updateCardSuc', data);
      }, (error) => {
        commit('updateCardErr', error);
      });
    },
    deleteCard ({ commit, state, getters }, id) {
      const card = getters.card(id);
      const { type } = card;
      const typeIndex = `${type}Index`;
      const index = card[typeIndex];

      const child = state.cardList.filter(value => value.type !== type && value[typeIndex] === index);

      console.log('child', type, typeIndex, index, child, child.length);
      // const hasChild = ;
      commit('deleteCard');

      axios({
        method: 'delete',
        url: `${localServer}/card/${id}`
      })
      .then((response) => {
        commit('deleteCardSuc', id);
      }, (error) => {
        commit('deleteCardErr', error);
      });
    }
  },
  getters: {
    activityCardIds: (state) => {
      return sortIndex(state.cardList.filter(card => card.type === 'activity'), 'activity').map(card => card.id);
    },
    activityCard: (state) => (id, index) => {
      return state.cardList.find(card => card.id === id && card.activityIndex === index);
    },
    taskCardIds: (state) => (index) => {
      return sortIndex(state.cardList.filter(card => card.type === 'task' && card.activityIndex === index), 'task').map(card => card.id);
    },
    taskCardNumber: (state, getters) => (index) => {
      return getters.taskCardIds(index).length;
    },
    card: (state) => (id) => {
      return state.cardList.find(card => card.id === id);
    },
    subtaskCardIds: (state) => (activityIndex, releaseIndex, taskIndex) => {
      return state.cardList.filter(card => card.type === 'subtask' &&
        card.activityIndex === activityIndex &&
        card.releaseIndex === releaseIndex &&
        card.taskIndex === taskIndex).map(card => card.id);
    },
    boardWidths: state => state.boardWidths
  },
  mutations: {
    setFocusId (state, id) {
      state.focusId = id;
    },
    openCard (state) {
      state.isOpen = true;
    },
    getCardList (state, id) {
      state.getCardList = true;
    },
    getCardListSuc (state, list) {
      state.getCardList = false;
      state.getCardListSuc = true;
      state.cardList = list;

      state.boardWidths = calcBoardWidths(list);
    },
    getCardListErr (state, err) {
      state.getCardList = false;
      state.getCardListErr = err;
    },
    createCard (state, { type, activityIndex, releaseIndex, taskIndex, subtaskIndex }) {
      state.createCard = true;
      state.createType = type;

      if (type === 'task') {
        const newBoardWidths = state.boardWidths.slice();
        newBoardWidths[activityIndex] += 128;
        state.boardWidths = newBoardWidths;
        state.createIndexs = {
          activityIndex,
          taskIndex
        };
      } else {
        state.createIndexs = {
          activityIndex,
          releaseIndex,
          taskIndex,
          subtaskIndex
        };
      }
    },
    addCard (state) {
      state.addCard = true;
    },
    addCardSuc (state, card) {
      state.addCard = false;
      state.addCardSuc = true;
      state.cardList.push(card);
      state.createCard = false;
      state.createType = '';
      state.createIndexs = {};

    },
    addCardErr (state, err) {
      state.addCard = false;
      state.addCardErr = err;
    },
    updateCard (state) {
      state.updateCard = true;
    },
    updateCardSuc (state, id, data) {
      state.updateCard = false;
      state.updateCardSuc = true;
    },
    updateCardErr (state, err) {
      state.updateCard = false;
      state.updateCardErr = err;
    },
    deleteCard (state) {
      state.deleteCard = true;
    },
    deleteCardSuc (state, id) {
      state.deleteCard = false;
      state.deleteCardSuc = true;

      const deleteIndex = state.cardList.findIndex(value => value.id === id);
      state.cardList.splice(deleteIndex, 1);

      state.boardWidths = calcBoardWidths(state.cardList);
    },
    deleteCardErr (state, err) {
      state.deleteCard = false;
      state.deleteCardErr = err;
    }
  }
};

function calcBoardWidths (list) {
  const activityNumber = list.filter(card => card.type === 'activity').length;
  const widths = [];

  for (let i = 0; i < activityNumber; i++) {
    const taskNumber = list.filter(card => card.type === 'task' && card.activityIndex === i).length;
    widths.push(taskNumber * 128 + 8);
  }

  return widths;
}

function sortIndex (list, type) {
  const typeIndex = `${type}Index`;
  return list.sort((a, b) => a[typeIndex] - b[typeIndex]);
}
