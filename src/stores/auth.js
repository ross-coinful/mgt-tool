// import apiClient from '../helpers/apiClient';
import axios from 'axios';
import { localServer, githubApi } from '../../data';

export default {
  state: {
    getTokenSuc: false,
    logout: false,
    token: null,
    user: null
  },
  actions: {
    getToken ({ commit }, code) {
      commit('getToken');

      axios({
        method: 'get',
        url: `${localServer}/auth/token/${code}`
      })
      .then((response) => {
        commit('getTokenSuc', response.data);
      }, (error) => {
        commit('getTokenErr', error);
      });
    },
    getUser ({ commit }) {
      commit('getUser');

      axios({
        method: 'get',
        url: `${githubApi}/user`,
        params: {
          access_token: localStorage.getItem('token')
        }
      })
      .then((response) => {
        console.log('user', response.data);
        commit('getUserSuc', response.data);
      }, (error) => {
        commit('getUserErr', error);
      });
    },
    logout ({ commit }) {
      commit('logout');

      // axios({
      //   method: 'get',
      //   url: `${githubApi}/user`,
      //   params: {
      //     access_token: localStorage.getItem('token')
      //   }
      // })
      // .then((response) => {
      //   console.log('user', response.data);
      //   commit('logoutSuc', response.data);
      // }, (error) => {
      //   commit('logoutErr', error);
      // });
    }
  },
  getters: {
  },
  mutations: {
    getToken (state) {
      state.getToken = true;
    },
    getTokenSuc (state, token) {
      state.getToken = false;
      state.getTokenSuc = true;
      state.token = token;

      localStorage.setItem('token', token);
    },
    getTokenErr (state, err) {
      state.getToken = false;
      state.getTokenErr = err;
    },
    getUser (state) {
      state.getUser = true;
    },
    getUserSuc (state, user) {
      state.getUser = false;
      state.getUserSuc = true;
      state.user = user;
    },
    getUserErr (state, err) {
      state.getUser = false;
      state.getUserErr = err;
    },
    logout (state) {
      state.logout = true;
      state.user = null;

      localStorage.removeItem('token');
    },
    logoutSuc (state, user) {
      state.logout = false;
      state.logoutSuc = true;
    },
    logoutErr (state, err) {
      state.logout = false;
      state.logoutErr = err;
    }
  }
};
