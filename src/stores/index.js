import Vue from 'vue';
import Vuex from 'vuex';
import card from './card';
import cardDetail from './cardDetail';
import release from './release';
import label from './label';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    card,
    cardDetail,
    release,
    label
  }
});
