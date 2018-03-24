import Vue from 'vue';
import Vuex from 'vuex';
import card from './card';
import release from './release';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    card,
    release
  }
});
