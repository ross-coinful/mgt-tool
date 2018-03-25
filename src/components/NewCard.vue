<template>
  <div :class="boardBodyClass">
    <div class="new-card" :style="style" @mouseover="show = true" @mouseout="show = false">
      <div v-if="isCreate" :class="setClass">
        <textarea v-model="title" v-focus @blur="saveCard" autofocus></textarea>
      </div>
      <div v-else class="add-card-container">
        <div v-show="show" class="add-card" @click="createCard">
          <Icon type="plus-circled" size="16"></Icon>
        </div>
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
    style () {
      let width = 'width: 20px';

      if (this.type === 'activity') {
        return 'position: relative; width: 128px';
      } else if (this.type === 'subtask') {
        width = 'width: 100%';
      }

      return `position: ${this.isCreate ? 'static' : 'absolute'}; ${width}`;
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

      if (type === 'activity') {
        this.$store.dispatch('updateBoardWidths', activityIndex + 1);
      } else if (type === 'task') {
        console.log('taskIndex', this.taskIndex);
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
  border: 0;
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
}

.add-card {
  text-align: center;
}
</style>
