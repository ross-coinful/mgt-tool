<template>
  <div :class="boardBodyClass" :style="noBorder">
    <div class="new-card" :style="style" @mouseover="show = true" @mouseout="show = false">
      <div v-if="isCreate" :class="setClass">
        <textarea v-model="title" v-focus @blur="saveCard" autofocus></textarea>
      </div>
      <div v-else class="add-card-container">
        <span v-show="show" class="add-card" @click="createCard">
          <Icon type="plus-circled" size="16"></Icon>
        </span>
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
    boardBodyClass () {
      return `${this.type === 'activity' ? 'board-body' : ''}`;
    },
    setClass () {
      return `card ${this.isFocus ? 'focus' : ''} ${this.type}-card`;
    },
    noBorder () { // type === 'activity' 才 work
      return `${this.$store.state.card.boardWidths.length === this.activityIndex ? 'border: 0' : ''}`;
    },
    style () {
      const position = `position: ${this.isCreate ? 'static' : 'absolute'};`;

      if (this.type === 'activity') {
        return 'position: relative; width: 128px';
      } else if (this.type === 'subtask') {
        return `${position} width: 100%`;
      } else if (this.type === 'task') {

        if (this.taskIndex > 0 && !this.isCreate) {
          return `${position} width: 20px; height: 100%; top: 0; display: flex; align-items: center`;
        } else {
          return `${position} width: 100%`;
        }
      }
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

      if (type === 'activity' && activityIndex > 0) { // 首次創立時 index = 0, 但已經有初始值所以不用update
        this.$store.dispatch('updateBoardWidths', activityIndex + 1);
      } else if (type === 'task') {
        if (this.taskIndex > 0) {
          this.$store.dispatch('updateBoardWidths', activityIndex);
        }

        this.cardData.taskIndex = taskIndex;
      } else if (type === 'subtask') {
        this.cardData.releaseIndex = releaseIndex;
        this.cardData.taskIndex = taskIndex;
        this.cardData.subtaskIndex = this.subtaskCardIds(this.taskIndex).length;
      }

      this.isCreate = true;
      this.show = false;
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
.board-body {
  padding-right: 3px; /* 4px - 1px border*/
}

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
  text-align: center;
}

.add-card {
  cursor: pointer;
}
</style>
