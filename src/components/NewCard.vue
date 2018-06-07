<template>
  <li :class="boardBodyClass" :style="noBorder">
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
  </li>
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
    activityNumber: {
      type: Number,
      required: false
    },
    taskNumber: {
      type: Number,
      required: false
    },
    parentId: {
      type: Number,
      required: false
    },
    releaseId: {
      type: Number,
      required: false
    }
  },
  store,
  computed: {
    boardBodyClass () {
      return `${this.type === 'activity' ? 'board-body board' : ''}`;
    },
    setClass () {
      return `card ${this.isFocus ? 'focus' : ''} ${this.type}-card`;
    },
    noBorder () { // 只有初始沒有任何activity card時, 才有border
      return `${this.type === 'activity' && this.$store.state.card.boardWidths.length === this.activityNumber ? 'border: 0' : ''}`;
    },
    style () {
      const position = `position: ${this.isCreate ? 'static' : 'absolute'};`;

      if (this.type === 'activity') {
        return 'position: relative; width: 128px';
      } else if (this.type === 'subtask') {
        return `${position} width: 100%`;
      } else if (this.type === 'task') {

        if (this.taskNumber > 0 && !this.isCreate) {
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
      const { type, parentId, releaseId, activityNumber } = this;
      const activityCardIds = this.$store.getters.activityCardIds;

      this.cardData = {
        type
      };

      if (type === 'activity' && activityNumber > 0) { // 首次創立時 index = 0, 但已經有初始值所以不用update
        this.$store.dispatch('updateBoardWidths', activityNumber);
        this.cardData.prevId = activityCardIds[activityCardIds.length - 1];
      } else if (type === 'task') {
        const taskCardIds = this.$store.getters.taskCardIds(parentId);

        if (this.taskNumber > 0) {
          const activityIndex = activityCardIds.findIndex(value => value === parentId);
          this.$store.dispatch('updateBoardWidths', activityIndex);
          this.cardData.prevId = taskCardIds[taskCardIds.length - 1];
        }
        this.cardData.parentId = parentId;
      } else if (type === 'subtask') {
        const subtaskCardIds = this.$store.getters.subtaskCardIds(parentId, releaseId);

        if (subtaskCardIds.length > 0) {
          this.cardData.prevId = subtaskCardIds[subtaskCardIds.length - 1];
        }
        this.cardData.parentId = parentId;
        this.cardData.releaseId = releaseId;
      }

      this.isCreate = true;
      this.show = false;
    },
    saveCard () {
      console.log('save');
      this.isFocus = false;
      this.cardData.title = this.title;
      this.cardData.mapId = this.$router.currentRoute.params.id;

      this.$store.dispatch('addCard', {
        data: this.cardData,
        callback: function () {
          this.isCreate = false;
          this.title = '';
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
  width: 99%; /*display:table-cell fill remaining width*/
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
  width: 100%;
  height: 20px;
  text-align: center;
}

.add-card {
  cursor: pointer;
}
</style>
