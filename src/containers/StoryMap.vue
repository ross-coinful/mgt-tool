<template>

  <div class="story-map">

    <div class="board-list list-container" style="height: 180px">
      <ActivityBoard
        v-for="(id, index) in activityCardIds"
        :id="id"
        :activityIndex="index"
        :taskCardIds="taskCardIds(index)"
        :width="$store.state.card.boardWidths[index]"
        :key="id">
      </ActivityBoard>

      <NewCard type="activity" :activityIndex="activityCardIds.length" />
    </div>

    <div>
      <div v-for="(release, releaseIndex) in releaseList" class="list-container" :key="release" :style="oneReleaseStyle">
        <div class="release-list">
          <div v-for="(width, index) in boardWidths" class="release-title" :style="{ width: width + 'px' }" :key="`width-${index}`">
            <span v-show="index === 0">{{ release }}</span>
          </div>
        </div>

        <div class="board-list">
          <TaskBoard
            v-for="(width, index) in boardWidths"
            :activityIndex="index"
            :releaseIndex="releaseIndex"
            :width="boardWidths[index]"
            :key="`width-${index}`">
          </TaskBoard>
        </div>
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
import NewCard from '@/components/NewCard';
import store from '../stores';
import { mapGetters } from 'vuex';

export default {
  name: 'StoryMap',
  store,
  computed: {
    ...mapGetters([
      'activityCardIds',
      'releaseList',
      'boardWidths'
    ]),
    oneReleaseStyle () {
      return this.releaseList.length === 1 ? 'display: flex; flex-direction: column; height: calc(100vh - 248px)' : '';
    }
  },
  mounted () {
    this.$store.dispatch('getCardList');
    this.$store.dispatch('getReleaseList');
  },
  components: {
    ActivityBoard,
    TaskBoard,
    NewCard
  },
  data () {
    return {
      isEditTitle: false,
      isFocusTitle: false,
      isEditDetail: false,
      isFocusDetail: false,
      cardTitle: this.title,
      cardDetail: this.detail,
      isSubtask: false
    };
  },
  methods: {
    taskCardIds (activityIndex) {
      return this.$store.getters.taskCardIds(activityIndex);
    },
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

.release-list {
  line-height: 21px;
}

.board-list {
  flex: 1;
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

/* 因為 type為activity 的 NewCard 並沒有被 board-body 包裹住 所以需要加上 padding */
/*.new-card {
  padding: 4px;
}*/
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
  /*height: 100%;*/
  padding: 4px;
  padding-right: 0;
  border-right: 1px dotted #bbb;
}

.link-btn-separator {
  color: #ddd;
}

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

.focus {
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.2);
}
</style>
