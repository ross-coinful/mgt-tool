import ApiClient from '../helpers/ApiClient';
import { defaultWidth } from '../../data';
import { sortList } from '../utils';

export default {
  state: {
    focusId: null,
    isOpen: false,
    cardList: [],
    boardWidths: [defaultWidth],
    shrinkCardIds: [],
    updateCard: false,
    updateCardSuc: false,
    updateCommentSuc: false
  },
  actions: {
    shrinkCard ({ commit }, id) {
      commit('shrinkCard', id);
    },
    expandCard ({ commit }, id) {
      commit('expandCard', id);
    },
    shrinkMultiCard ({ commit }, ids) {
      commit('shrinkMultiCard', ids);
    },
    setFocusId ({ commit }, id) {
      commit('setFocusId', id);
    },
    openCard ({ commit }) {
      commit('openCard');
    },
    closeCard ({ commit }) {
      commit('closeCard');
    },
    updateBoardWidths ({ commit }, activityIndex) {
      commit('updateBoardWidths', activityIndex);
    },
    addCard ({ commit, rootState, state }, { data, callback }) {
      commit('addCard');

      const mapId = rootState.map.map.id;
      const { type } = data;

      if (type === 'subtask') {
        data.labelId = 0;
      }

      ApiClient.POST(`/map/${mapId}/card`, {
        data
      })
      .then((id) => {
        data.id = id;
        callback();
        commit('addCardSuc', data);
      }, (error) => {
        commit('addCardErr', error);
      });
    },
    updateCard ({ commit, rootState }, data) {
      commit('updateCard');

      const mapId = rootState.map.map.id;

      ApiClient.PATCH(`/map/${mapId}/card`, {
        data
      }).then((cardList) => {
        commit('updateCardSuc', cardList);
      }, (error) => {
        commit('updateCardErr', error);
      });
    },
    updateCardPos ({ commit, rootState }, data) {
      commit('updateCardPos', data);

      const mapId = rootState.map.map.id;

      ApiClient.PATCH(`/map/${mapId}/card`, {
        data
      }).then((response) => {
        console.log('updateCardPos suc');
      }, (error) => {
        console.log('updateCardPos', error);
      });
    },
    deleteCard ({ commit, rootState, state, getters }, id) {
      const card = getters.card(id);
      const { type } = card;
      const nextId = getters.nextCardId(id);
      let ids = [id];

      if (type === 'activity') {
        const taskChild = getters.childCardIds(id);
        ids = ids.concat(taskChild);

        // add subtask child ids
        taskChild.forEach(taskId => {
          ids = ids.concat(getters.childCardIds(taskId));
        });
      } else if (type === 'task') {
        const child = getters.childCardIds(id);
        ids = ids.concat(child);
      }

      commit('deleteCard');

      const mapId = rootState.map.map.id;

      ApiClient.DELETE(`/map/${mapId}/card`, {
        data: ids
      }).then((response) => {

        if (nextId !== null) {
          const prevId = 'prevId' in card ? card.prevId : null;

          commit('deleteCardSuc', {ids, nextId, prevId});

          ApiClient.PATCH('/card', {
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
    },
    addComment ({ commit, rootState, state }, data) {
      commit('updateComment');

      const mapId = rootState.map.map.id;
      const cardId = rootState.card.focusId;

      ApiClient.POST(`/map/${mapId}/card/${cardId}/comment`, {
        data
      })
      .then((card) => {
        commit('updateCommentSuc', card);
      }, (error) => {
        commit('updateCommentErr', error);
      });
    },
    updateComment ({ commit, rootState, state }, { commentId, body }) {
      commit('updateComment');

      const mapId = rootState.map.map.id;
      const cardId = rootState.card.focusId;

      ApiClient.PATCH(`/map/${mapId}/card/${cardId}/comment/${commentId}`, {
        data: {
          body
        }
      })
      .then((card) => {
        commit('updateCommentSuc', card);
      }, (error) => {
        commit('updateCommentErr', error);
      });
    },
    deleteComment ({ commit, rootState, state }, commentId) {
      commit('updateComment');

      const mapId = rootState.map.map.id;
      const cardId = rootState.card.focusId;

      ApiClient.DELETE(`/map/${mapId}/card/${cardId}/comment/${commentId}`)
      .then((card) => {
        commit('updateCommentSuc', card);
      }, (error) => {
        commit('updateCommentErr', error);
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
    shrinkCard (state, id) {
      const newShrinkIds = state.shrinkCardIds.slice();

      if (newShrinkIds.indexOf(id) === -1) {
        newShrinkIds.push(id);
      }

      state.shrinkCardIds = newShrinkIds;
    },
    expandCard (state, id) {
      const newShrinkIds = state.shrinkCardIds.slice();
      const removeIndex = newShrinkIds.indexOf(id);
      newShrinkIds.splice(removeIndex, 1);

      state.shrinkCardIds = newShrinkIds;
    },
    shrinkMultiCard (state, ids) {
      state.shrinkCardIds = ids;
    },
    setFocusId (state, id) {
      state.focusId = id;
    },
    openCard (state) {
      state.isOpen = true;
    },
    closeCard (state) {
      state.isOpen = false;
    },
    setCardList (state, list) {
      state.cardList = list;

      state.boardWidths = calcBoardWidths(list);
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
    updateCardPos (state, data) {
      state.updateCard = true;

      const newCardList = state.cardList.slice();

      data.forEach(value => {
        const _card = newCardList.find(card => card.id === value.id);

        Object.keys(value).forEach(key => {

          if (value[key] === null) {
            delete _card[key];
          } else {
            _card[key] = value[key];
          }
        });
      });

      state.cardList = newCardList;

      console.log('newCardList', newCardList);

      state.boardWidths = calcBoardWidths(newCardList);
    },
    updateCard (state) {
      state.updateCard = true;
      state.updateCardSuc = false;
    },
    updateCardSuc (state, cardList) {
      state.updateCard = false;
      state.updateCardSuc = true;
      state.cardList = cardList;
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
        const deleteIndex = newCardList.findIndex(value => value.id === id);
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
    },
    updateComment (state) {
      state.updateComment = true;
      state.updateCommentSuc = false;
    },
    updateCommentSuc (state, data) {
      state.updateComment = false;
      state.updateCommentSuc = true;

      const newCardList = state.cardList.slice();
      const _card = newCardList.find(card => card.id === data.id);
      Object.assign(_card, data);

      state.cardList = newCardList;
    },
    updateCommentErr (state, err) {
      state.updateComment = false;
      state.updateCommentErr = err;
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
