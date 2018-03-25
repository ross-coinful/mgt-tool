<template>
  <div class="new-card" :style="style">
    <div v-if="isCreate" :class="setClass">
      <textarea v-model="title" v-focus @blur="saveCard" autofocus></textarea>
    </div>
    <div v-else class="add-card-container" @mouseover="show = true" @mouseout="show = false">
      <div v-show="show" class="add-card" @click="createCard">
        <Icon type="plus-circled" size="16"></Icon>
      </div>
    </div>
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
    },
    activityIndex: {
      type: Number,
      required: true
    },
    taskIndex: {
      type: Number,
      required: false
    },
    releaseIndex: {
      type: Number,
      required: false
    },
    subtaskCardIds: {
      type: Function,
      required: false
    }
  },
  store,
  computed: {
    setClass () {
      return `card ${this.isFocus ? 'focus' : ''} ${this.type}-card`;
    },
    style () {
      const position = `position: ${this.isCreate ? 'static;' : 'absolute;'}`;
      const width = `width: ${this.type === 'subtask' ? '100%' : '20px'}`;
      return position + width;
    }
  },
  data () {
    return {
      show: false,
      isCreate: false,
      isFocus: true,
      title: ''
    };
  },
  methods: {
    createCard (e) {
      const { type, activityIndex, releaseIndex, taskIndex } = this;

      this.cardData = {
        type,
        activityIndex
      };

      if (type === 'task') {
        this.$store.dispatch('updateBoardWidths', activityIndex);
      }

      if (type === 'subtask') {
        this.cardData.releaseIndex = releaseIndex;
        this.cardData.taskIndex = taskIndex;
        this.cardData.subtaskIndex = this.subtaskCardIds(this.taskIndex).length;
      }

      this.isCreate = true;
      this.show = false;
      // this.$store.dispatch('createCard', data);
    },
    saveCard () {
      console.log('save');
      this.isFocus = false;
      this.cardData.title = this.title;

      this.$store.dispatch('addCard', {
        data: this.cardData,
        callback: function () {
          this.isCreate = false;
        }.bind(this)
      });
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
.new-card {
  right: 0;
  min-width: 16px;
  min-height: 16px;
}

textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: 0;
  resize: none;
}

.add-card-container {
  position: absolute;
  width: 100%;
  height: 20px;
}

.add-card {
  text-align: center;
}
</style>
