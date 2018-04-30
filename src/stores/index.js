import Vue from 'vue';
import Vuex from 'vuex';
import card from './card';
import cardDetail from './cardDetail';
import release from './release';
import auth from './auth';
import map from './map';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    card,
    cardDetail,
    release,
    auth,
    map
  }
});
