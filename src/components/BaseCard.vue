<template>
  <div :class="setClass" :data-id="id" @mouseover="show = true" @mouseout="show = false">
    <div style="height: 100%" @click="focusCard">
      <slot ></slot>
    </div>
    <div v-if="type === 'activity'" v-show="show" class="card-toolbar">
      <span @click="shrinkCard">
        <Icon type="chevron-left"></Icon>
      </span>
    </div>
  </div>
</template>

<script>
import store from '../stores';

export default {
  name: 'BaseCard',
  props: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  store,
  computed: {
    setClass () {
      return `card ${this.$store.state.card.focusId === this.id ? 'focus' : ''} ${this.type}-card`;
    }
  },
  data () {
    return {
      show: false
    };
  },
  methods: {
    focusCard () {
      if (this.$store.state.card.focusId === this.id) {
        this.$store.dispatch('openCard');
      } else {
        this.$store.dispatch('setFocusId', this.id);
      }
    },
    shrinkCard () {
      this.$store.dispatch('shrinkCard', this.id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-toolbar {
  position: absolute;
  z-index: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 22px;
  padding-right: 3px;
  padding-top: 4px; /*垂直置中*/
  background-color: #eee;
  opacity: 0.5;
}
</style>
