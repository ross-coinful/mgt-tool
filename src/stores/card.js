// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';
import { sortList } from '../utils';
const defaultWidth = 136;

export default {
  state: {
    focusId: null,
    isOpen: false,
    cardList: [],
    boardWidths: [defaultWidth]
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
    updateBoardWidths ({ commit }, activityIndex) {
      commit('updateBoardWidths', activityIndex);
    },
    addCard ({ commit, state }, { data, callback }) {
      commit('addCard');

      const { type } = data;

      if (type === 'subtask') {
        data.label = 'todo';
      }

      axios({
        method: 'post',
        url: `${localServer}/card`,
        data
      })
      .then((response) => {
        data.id = response.data;
        callback();
        commit('addCardSuc', data);
      }, (error) => {
        commit('addCardErr', error);
      });
    },
    updateCard ({ commit, getters }, { id, data }) {
      console.log('updatecard');
      commit('updateCard', { id, data, getters });

      axios({
        method: 'patch',
        url: `${localServer}/card/${id}`,
        data
      })
      .then((response) => {
        commit('updateCardSuc');
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
      return sortList(state.cardList.filter(card => card.type === 'activity')).map(value => value.id);
    },
    taskCardIds: (state) => (id) => {
      return sortList(state.cardList.filter(card => card.type === 'task' && card.parentId === id)).map(card => card.id);
    },
    subtaskCardIds: (state) => (parentId, releaseId) => {
      return sortList(state.cardList.filter(card => card.type === 'subtask' &&
        card.parentId === parentId &&
        card.releaseId === releaseId)).map(card => card.id);
    },
    card: (state) => (id) => {
      return state.cardList.find(card => card.id === id);
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
    updateBoardWidths (state, activityIndex) {
      const newBoardWidths = state.boardWidths.slice();

      if (activityIndex < newBoardWidths.length) {
        newBoardWidths[activityIndex] += 128;
      } else if (activityIndex !== 0) {
        console.log('push');
        newBoardWidths.push(defaultWidth); // 增加 activity card
      }

      state.boardWidths = newBoardWidths;
    },
    addCard (state) {
      state.addCard = true;
    },
    addCardSuc (state, card) {
      state.addCard = false;
      state.addCardSuc = true;
      // state.cardList = state.cardList.slice().push(card);
      state.cardList.push(card);
    },
    addCardErr (state, err) {
      state.addCard = false;
      state.addCardErr = err;
    },
    updateCard (state, { id, data, getters }) {
      state.updateCard = true;
      const _id = parseInt(id, 10);
      const cardIndex = state.cardList.findIndex(value => value.id === _id);
      const card = state.cardList[cardIndex];
      const _card = Object.assign({}, card);

      Object.keys(data).forEach(key => {

        if (data[key] === null) {

          if (key in _card) {
            delete _card[key];
          }
        } else {
          _card[key] = data[key];
        }
      });

      let oldListIds = [];

      if (card.type === 'task') {
        oldListIds = getters.taskCardIds(card.parentId);
      } else if (card.type === 'subtask') {
        oldListIds = getters.subtaskCardIds(card.parentId, card.releaseId);
      }

      let newListIds = [];

      if (_card.type === 'task') {
        newListIds = getters.taskCardIds(_card.parentId);
      } else if (_card.type === 'subtask') {
        const parentId = _card.parentId || card.parentId;
        const releaseId = _card.releaseId || card.releaseId;

        newListIds = getters.subtaskCardIds(parentId, releaseId);
      }

      const newCardList = state.cardList.slice();
      newCardList[cardIndex] = _card;

      if (newListIds.indexOf(_id) === -1) { // does leave origin list, true = yes
        oldListIds.splice(oldListIds.indexOf(_id), 1); // 把自己移除

        updatePrevId(oldListIds, newCardList);
      } else {
        newListIds.splice(newListIds.indexOf(_id), 1); // 把自己移除
      }

      // 在新位子加入自己
      const newIndex = 'prevId' in data ? newListIds.findIndex(id => id === data.prevId) + 1 : 0;
      newListIds.splice(newIndex, 0, _id);
      updatePrevId(newListIds, newCardList);

      state.cardList = newCardList;

      if (card.type === 'task' || _card.type === 'task') {
        state.boardWidths = calcBoardWidths(newCardList);
      }
    },
    updateCardSuc (state) {
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

      const newCardList = state.cardList.slice();
      const deleteIndex = state.cardList.findIndex(value => value.id === id);

      const { prevId } = newCardList.find(value => value.id === id);

      newCardList.splice(deleteIndex, 1);
      const nextCard = newCardList.find(value => value.prevId === id);

      if (nextCard) {

        if (typeof prevId !== 'undefined') {
          nextCard.prevId = prevId;
        } else {
          delete nextCard.prevId;
        }
      }

      state.cardList = newCardList;
      state.boardWidths = calcBoardWidths(newCardList);
    },
    deleteCardErr (state, err) {
      state.deleteCard = false;
      state.deleteCardErr = err;
    }
  }
};

function calcBoardWidths (list) {
  const activityCardIds = sortList(list.filter(card => card.type === 'activity')).map(card => card.id);
  const widths = [];

  activityCardIds.forEach(value => {
    const taskNumber = list.filter(card => card.type === 'task' && card.parentId === value).length;
    widths.push(taskNumber * 128 + 9);
  });

  if (widths.length === 0) {
    widths.push(defaultWidth);
  }

  return widths;
}

function updatePrevId (listIds, cardList) {
  console.log('listIds', listIds);
  listIds.forEach((id, index) => {
    const card = cardList.find(value => value.id === id);

    if (index === 0) {

      if ('prevId' in card) {
        delete card.prevId;
      }
    } else {
      card.prevId = listIds[index - 1];
    }
  });
}
