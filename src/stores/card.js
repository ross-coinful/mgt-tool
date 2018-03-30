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
        data.labelId = 0;
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
    updateCard ({ commit, getters }, { id, data, command }) {

      switch (command) {
        case 'drag':
          commit('updateCardPos', { id, data, getters });
          break;
        case 'label':
          commit('updateCardLabel', { id, data });
          data.id = id;

          axios({
            method: 'patch',
            url: `${localServer}/card`,
            data: [data]
          })
          .then((response) => {
            commit('updateCardSuc');
          }, (error) => {
            commit('updateCardErr', error);
          });
          break;
        default:
          break;
      }
    },
    deleteCard ({ commit, state, getters }, id) {
      const card = getters.card(id);
      const { type } = card;
      const nextId = getters.nextCardId(id);
      let ids = [id];

      if (type === 'activity') {
        const taskChild = getters.childCardIds(id);
        ids = ids.concat(taskChild);
        console.log('herer', taskChild);

        // add subtask child ids
        taskChild.forEach(taskId => {
          ids = ids.concat(getters.childCardIds(taskId));
        });
      } else if (type === 'task') {
        const child = getters.childCardIds(id);
        ids = ids.concat(child);
      }

      commit('deleteCard');

      axios({
        method: 'delete',
        url: `${localServer}/card`,
        data: ids
      })
      .then((response) => {

        if (nextId !== null) {
          const prevId = 'prevId' in card ? card.prevId : null;

          commit('deleteCardSuc', {ids, nextId, prevId});

          axios({
            method: 'patch',
            url: `${localServer}/card`,
            data: [{
              id: nextId,
              prevId
            }]
          }).then((res) => {
            console.log('updateCardPrevId suc');
          }, (err) => {
            console.log('updateCardPrevId fail', err);
          });
        } else {
          commit('deleteCardSuc', {ids});
        }
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
    childCardIds: (state) => (parentId) => {
      return state.cardList.filter(value => value.parentId === parentId).map(value => value.id);
    },
    nextCardId: (state) => (id) => {
      const nextCard = state.cardList.find(value => value.prevId === id);
      return nextCard ? nextCard.id : null;
    },
    boardWidths: state => state.boardWidths,
    cardList: state => state.cardList
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

      const newCardList = state.cardList.slice();
      newCardList.push(card);

      state.cardList = newCardList;
    },
    addCardErr (state, err) {
      state.addCard = false;
      state.addCardErr = err;
    },
    updateCardLabel (state, { id, data }) {
      const _id = parseInt(id, 10);
      const cardIndex = state.cardList.findIndex(value => value.id === _id);
      const card = state.cardList[cardIndex];
      const _card = Object.assign({}, card);
      const newCardList = state.cardList.slice();

      _card.labelId = data.labelId;
      newCardList[cardIndex] = _card;
      state.cardList = newCardList;
    },
    updateCardPos (state, { id, data, getters }) {
      state.updateCard = true;
      const _id = parseInt(id, 10);
      const cardIndex = state.cardList.findIndex(value => value.id === _id);
      const card = state.cardList[cardIndex];
      const _card = Object.assign({}, card);
      const updatedData = {
        id: _id
      };
      let updatedDatas = [];

      Object.keys(data).forEach(key => {

        if (data[key] === null) {

          if (key in _card) {
            delete _card[key];
            updatedData[key] = null;
          }
        } else {
          _card[key] = data[key];
          updatedData[key] = data[key];
        }
      });

      updatedDatas.push(updatedData);

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

        updatedDatas = updatedDatas.concat(updatePrevId(oldListIds, newCardList));
      } else {
        newListIds.splice(newListIds.indexOf(_id), 1); // 把自己移除
      }

      // 在新位子加入自己
      const newIndex = 'prevId' in data ? newListIds.findIndex(id => id === data.prevId) + 1 : 0;
      newListIds.splice(newIndex, 0, _id);
      updatedDatas = updatedDatas.concat(updatePrevId(newListIds, newCardList));

      state.cardList = newCardList;

      if (card.type === 'task' || _card.type === 'task') {
        state.boardWidths = calcBoardWidths(newCardList);
      }

      console.log('updatedDatas', updatedDatas);

      axios({
        method: 'patch',
        url: `${localServer}/card`,
        data: updatedDatas
      })
      .then((response) => {
        console.log('updateCardPos suc');
      }, (error) => {
        console.log('updateCardPos', error);
      });
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
    deleteCardSuc (state, {ids, nextId = null, prevId = null}) {
      state.deleteCard = false;
      state.deleteCardSuc = true;

      const newCardList = state.cardList.slice();

      ids.forEach(id => {
        const deleteIndex = state.cardList.findIndex(value => value.id === id);
        newCardList.splice(deleteIndex, 1);
      });

      if (nextId !== null) {
        const nextCardIndex = newCardList.findIndex(value => value.id === nextId);
        const nextCard = newCardList[nextCardIndex];
        const _card = Object.assign({}, nextCard);

        if (prevId !== null) {
          _card.prevId = prevId;
        } else if ('prevId' in _card) {
          delete _card.prevId;
        }

        newCardList[nextCardIndex] = _card;
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
    const taskNumber = list.filter(card => card.type === 'task' && card.parentId === value).length || 1; // 可能activity的task數量為0
    widths.push(taskNumber * 128 + 9);
  });

  if (widths.length === 0) {
    widths.push(defaultWidth);
  }

  return widths;
}

function updatePrevId (listIds, cardList) {
  const updatedDatas = [];

  listIds.forEach((id, index) => {
    const card = cardList.find(value => value.id === id);

    if (index === 0) {

      if ('prevId' in card) {
        delete card.prevId;

        updatedDatas.push({
          id,
          prevId: null
        });
      }
    } else {
      const newPrevId = listIds[index - 1];

      if (newPrevId !== card.prevId) {
        card.prevId = newPrevId;

        updatedDatas.push({
          id,
          prevId: newPrevId
        });
      }
    }
  });

  console.log('in function', updatedDatas);

  return updatedDatas;
}
