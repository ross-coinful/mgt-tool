<template>

  <div class="story-map">
    <div class="board-list list-container">
      <ActivityBoard
        v-for="(id, index) in activityCardIds"
        :id="id"
        :activityIndex="index"
        :width="widths[0]"
        :key="id">
      </ActivityBoard>
    </div>

  <!-- 用widths for 貨 activityIndex 長度 -->
    <div v-for="release in releaseList" class="list-container" :key="release">
      <div class="release-list">
        <div class="release-title" :style="{ width: widths[0] + 'px' }">{{ release.title }}</div>
        <div class="release-title" :style="{ width: widths[1] + 'px' }"></div>
        <div class="release-title"></div>
      </div>

      <div class="board-list">
        <TaskBoard
          v-for="(id, index) in activityCardIds"
          :activityIndex="index"
          :releaseIndex="release.index"
          :width="widths[0]"
          :key="id">
        </TaskBoard>
      </div>
    </div>

    <Modal
      v-model="$store.state.card.isOpen"
      title="Card"
      ok-text="add comment"
      @on-visible-change="clearStatus">
      <div class="title">
        <p class="display" v-if="!isEditTitle" @click="toggleEditTitle">{{ cardTitle }} Click to add title.</p>
        <input class="input" v-else v-model="cardTitle" type="text" @blur="toggleEditTitle" v-focus="isFocusTitle" />
      </div>

      <div class="detail">
        <p class="display" v-if="!isEditDetail" @click="toggleEditDetail">{{ cardDetail }} Click to add details.</p>
        <textarea class="input" v-else v-model="cardDetail" @blur="toggleEditDetail" v-focus="isFocusDetail"></textarea>
      </div>

      <div slot="footer">
        <Button type="text">add comment</Button>
        <span class="link-btn-separator">&nbsp;|&nbsp;</span>
        <Button type="text">add attachment</Button>
        <span class="link-btn-separator">&nbsp;|&nbsp;</span>
        <Button type="text" v-show="isSubtask">add attachment</Button>
        <span class="link-btn-separator" v-show="isSubtask">&nbsp;|&nbsp;</span>
        <Button type="text">delete card</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
import ActivityBoard from '@/components/ActivityBoard';
import TaskBoard from '@/components/TaskBoard';
import store from '../stores';

export default {
  name: 'StoryMap',
  store,
  computed: {
    activityCardIds () {
      return this.$store.getters.activityCardIds;
    },
    subtaskCardIds () {
      return this.$store.getters.subtaskCardIds;
    }
  },
  mounted () {
    this.$store.dispatch('getCardList');
  },
  components: {
    ActivityBoard: ActivityBoard,
    TaskBoard: TaskBoard
  },
  data () {
    return {
      isEditTitle: false,
      isFocusTitle: false,
      isEditDetail: false,
      isFocusDetail: false,
      cardTitle: this.title,
      cardDetail: this.detail,
      isSubtask: false,
      widths: [270, 400]
    };
  },
  methods: {
    toggleEditTitle () {
      this.toggleEdit('Title');
    },
    toggleEditDetail () {
      this.toggleEdit('Detail');
    },
    toggleEdit (type) {

      if (this[`isEdit${type}`]) {
        this[`isFocus${type}`] = false;
        this[`isEdit${type}`] = false;
      } else {
        this[`isFocus${type}`] = true;
        this[`isEdit${type}`] = true;
      }
    },
    clearStatus (visible) {

      if (visible) {
        // getCardContent();
      } else {
        // this.isFocus = false;
        // this.isEdit = false;
      }
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
.story-map {
  text-align: left;
}

.list-container {
  margin-bottom: 4px;
  background-color: #efefef;
}

.board-list,
.release-list {
  display: flex;
  flex-direction: row;
}

.release-title {
  padding-left: 8px;
  border-right: 1px dotted #bbb;
  border-bottom: 1px dotted #bbb;
  color: #66b9e1;
  font-size: 14px;
}

.release-title:last-child {
  flex: 1;
  border-right: 0;
}

.display {
  cursor: pointer;
}

.input {
  width: 100%;
  height: 100%;
  border: 1px dotted #aaa;
  outline: 0;
}

.title {
  height: 30px;
  margin-bottom: 20px;
}

.title .display {
  color: #282828;
  font-weight: bold;
  font-size: 16px;
}

.detail,
.detail .input {
  min-height: 160px;
}

.detail .display {
  color: #282828;
  font-size: 14px;
}
</style>

<style>
/* overwrite iview style start*/
/*.ivu-card {
  width: 120px;
  height: 78px;
  padding: 3px;
  margin: 4px;
  border-radius: 0;
  font-size: 12px;
  text-align: left;
}

.ivu-card-body {
  padding: 0;
}*/

.ivu-modal-header {
  display: flex;
  align-items: center;
  height: 80px;
}

.ivu-modal-header-inner {
  font-size: 28px;
  font-weight: normal;
  color: #66bae1;
}

.ivu-modal-content {
  border-radius: 0;
}

.ivu-modal-footer {
  text-align: left;
}

.ivu-modal-footer button+button {
  margin-left: 0;
}

.ivu-btn-text {
  font-size: 14px;
  color: #66b9e1;
}
/* overwrite iview style end*/

.board-body {
  padding: 4px;
  border-right: 1px dotted #bbb;
}

.focus {
  border-width: 2px;
  border-color: #000;
}

.link-btn-separator {
  color: #ddd;
}
</style>
