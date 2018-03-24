<template>
  <div :class="setClass">
    <textarea v-model="title" v-focus @blur="saveCard" autofocus></textarea>
  </div>
</template>

<script>
import store from '../stores';

export default {
  name: 'NewCard',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  store,
  computed: {
    setClass () {
      return `card ${this.isFocus ? 'focus' : ''} ${this.type}-card`;
    }
  },
  data () {
    return {
      show: false,
      isFocus: true,
      title: ''
    };
  },
  methods: {
    saveCard () {
      console.log('save');
      this.isFocus = false;
      this.$store.dispatch('addCard', this.title);
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: 0;
  resize: none;
}
</style>
