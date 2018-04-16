// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer } from '../../data';

export default {
  state: {
    releaseList: [],
    shrinkReleaseIds: []
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
    },
    shrinkRelease ({ commit }, id) {
      console.log('id', id);
      commit('shrinkRelease', id);
    },
    expandRelease ({ commit }, id) {
      commit('expandRelease', id);
    },
    addRelease ({ commit }, data) {
      commit('addRelease');

      axios({
        method: 'post',
        url: `${localServer}/release`,
        data
      })
      .then((response) => {
        data.id = response.data;

        commit('addReleaseSuc', data);
      }, (error) => {
        commit('addReleaseErr', error);
      });
    },
    updateRelease ({ commit }, data) {
      commit('updateRelease');

      axios({
        method: 'patch',
        url: `${localServer}/release`,
        data
      })
      .then((response) => {
        commit('updateReleaseSuc', data);
      }, (error) => {
        commit('updateReleaseErr', error);
      });
    }
  },
  getters: {
    releaseList: state => state.releaseList,
    shrinkReleaseIds: state => state.shrinkReleaseIds
  },
  mutations: {
    getReleaseList (state) {
      state.getReleaseList = true;
    },
    getReleaseListSuc (state, list) {
      state.getReleaseList = false;
      state.getReleaseListSuc = true;
      state.releaseList = sortOrder(list);
    },
    getReleaseListErr (state, err) {
      state.getReleaseList = false;
      state.getReleaseListErr = err;
    },
    shrinkRelease (state, id) {
      state.shrinkReleaseIds.push(id);
    },
    expandRelease (state, id) {
      const removeIndex = state.shrinkReleaseIds.indexOf(id);

      state.shrinkReleaseIds.splice(removeIndex, 1);
    },
    moveRelease (state, { id, way }) {
      const newReleaseList = state.releaseList.slice();
      const oldIndex = newReleaseList.findIndex(value => value.id === id);
      const release = newReleaseList[oldIndex];
      const newIndex = way === 'down' ? oldIndex + 1 : oldIndex - 1;

      newReleaseList[oldIndex] = newReleaseList[newIndex];
      newReleaseList[newIndex] = release;
      state.releaseList = newReleaseList;
    },
    addRelease (state) {
      state.addRelease = true;
    },
    addReleaseSuc (state, data) {
      const newReleaseList = state.releaseList.slice();
      newReleaseList.push(data);

      state.releaseList = sortOrder(newReleaseList);
      state.addRelease = false;
      state.addReleaseSuc = true;
    },
    addReleaseErr (state, err) {
      state.addRelease = false;
      state.addReleaseErr = err;
    },
    updateRelease (state) {
      state.updateRelease = true;
    },
    updateReleaseSuc (state, data) {
      const newReleaseList = state.releaseList.slice();

      data.forEach(value => {
        const index = newReleaseList.findIndex(release => release.id === value.id);

        Object.keys(value).forEach(key => {
          newReleaseList[index][key] = value[key];
        });
      });

      state.releaseList = sortOrder(newReleaseList);
      state.updateRelease = false;
      state.updateReleaseSuc = true;
    },
    updateReleaseErr (state, err) {
      state.updateRelease = false;
      state.updateReleaseErr = err;
    }
  }
};

function sortOrder (list) {
  return list.sort((a, b) => a.order - b.order);
}
