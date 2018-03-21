<template>
  <div :class="setClass" @click="focusCard" @mouseover="show = true" @mouseout="show = false">
    <slot></slot>

    <div v-show="show" class="add-card" @click="openCard">
      <Icon  type="plus-circled" size="16"></Icon>
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
        this.openCard();
      } else {
        this.$store.dispatch('setFocusId', this.id);
      }
    },
    openCard () {
      this.$store.dispatch('openCard');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  position: relative;
  width: 120px;
  height: 78px;
  padding: 3px;
  margin: 4px;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
}

.subtask-card {
  background-color: #ffffff;
  border-color: #cecece;
  color: #4f4f4f;
}

.task-card {
  background-color: #f4e459;
  border-color: #e8cf01;
  color: #635207;
}

.activity-card {
  background-color: #aed9e9;
  border-color: #8fcbe3;
  color: #274e5b;
}

.add-card {
  position: absolute;
  z-index: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 22px;
  padding-right: 3px;
  padding-top: 4px; /* 垂直置中 */
  background-color: #eee;
  opacity: 0.5;
}
</style>
