<template>

  <div class="story-map">

    <div class="board-list list-container" style="height: 180px">
      <ActivityBoard
        v-for="(id, index) in activityCardIds"
        :parentId="id"
        :taskCardIds="taskCardIds(id)"
        :width="$store.state.card.boardWidths[index]"
        :key="id"
        :onEnd="onEnd"
        :onMove="onMove">
      </ActivityBoard>

      <NewCard type="activity" :activityNumber="activityCardIds.length" />
    </div>

    <!-- 只有在add a release above the unscheduled, 且 unscheduled order = 0 -->
    <div
      v-if="createReleaseIndex === -1"
      class="board-list list-container"
    >
      <div class="release-title">
        <input class="input" v-model="title" type="text" @blur="addRelease" autofocus />
      </div>
    </div>

    <div>
      <div v-for="(release, releaseIndex) in releaseList" :key="release.id">
        <Release
          :releaseId="release.id"
          :releaseTitle="release.title"
          :releaseIndex="releaseIndex"
          :setCreateReleasePos="setCreateReleasePos"
          :isShrink="isShrink(release.id)"
        />
        <div class="board-list list-container" :style="oneReleaseStyle">
          <TaskBoard
            v-for="(width, index) in boardWidths"
            :parentId="activityCardIds[index]"
            :releaseId="release.id"
            :width="calcWidth(width, index)"
            :index="index"
            :key="`width-${index}`"
            :draggedId="draggedId"
            :fillSpace="checkFillSpace(activityCardIds[index])"
            :fillIndex="fillIndex"
            :isShrink="isShrink(release.id)"
            :onEnd="onEnd"
            :onMove="onMove">
          </TaskBoard>

        </div>

        <div
          v-if="releaseIndex === createReleaseIndex"
          class="board-list list-container"
        >
          <div class="release-title">
            <input
              class="input"
              v-model="title"
              type="text"
              @blur="addRelease"
              @focus="$event.target.select()"
              v-focus="isFocus"
            />
          </div>
        </div>

      </div>
    </div>
    <CardModal />
  </div>
</template>

<script>
import ActivityBoard from '@/components/ActivityBoard';
import TaskBoard from '@/components/TaskBoard';
import NewCard from '@/components/NewCard';
import CardModal from '@/components/CardModal';
import Release from '@/components/Release';
import store from '../stores';
import { defaultWidth } from '../../data';
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
    },
    title: {
      get () {
        return this.newRelease || `New release-${this.releaseList.length + 1}`;
      },
      set (value) {
        this.newRelease = value;
      }
    }
  },
  mounted () {
    this.$store.dispatch('getCardList');
    this.$store.dispatch('getReleaseList');
    this.$store.dispatch('getLabelList');
  },
  components: {
    ActivityBoard,
    TaskBoard,
    NewCard,
    CardModal,
    Release
  },
  data () {
    return {
      addWidthIndex: null,
      subtractWidthIndex: null,
      draggedId: null,
      fillParentId: null,
      fillIndex: null,
      createReleaseIndex: null,
      createReleaseOrder: null,
      newRelease: '',
      isFocus: false
    };
  },
  methods: {
    isShrink (releaseId) {
      return this.$store.state.release.shrinkReleaseIds.indexOf(releaseId) !== -1;
    },
    taskCardIds (parentId) {
      return this.$store.getters.taskCardIds(parentId);
    },
    checkFillSpace (parentId) {
      return parentId === this.fillParentId;
    },
    onEnd (evt) {
      const id = parseInt(evt.item.dataset.id, 10);
      const fromData = evt.from.dataset;
      const toData = evt.to.dataset;

      this.addWidthIndex = null;
      this.subtractWidthIndex = null;
      this.draggedId = null;
      this.fillParentId = null;
      this.fillIndex = null;

      if (fromData.name === toData.name) {

        if (evt.oldIndex === evt.newIndex) {
          return false;
        } else if (toData.type === 'task' && evt.newIndex === this.taskCardIds(parseInt(toData.parentid, 10)).length) {
          // 如果拖到list的極致左右邊緣index會偵測為list的長度, 這會導致後面計算錯誤
          return false;
        }
      }

      const fromType = fromData.type;
      const toType = toData.type;
      const { taskCardIds, subtaskCardIds, cardList } = this.$store.getters;
      const data = {
        id
      };

      switch (toType) {
        case 'task': {
          const parentid = parseInt(toData.parentid, 10);

          data.parentId = parentid;
          data.type = 'task';

          if (fromType === 'subtask') {
            data.releaseId = null;
            data.labelId = null;
          }
          break;
        }
        case 'subtask': {
          const parentid = parseInt(toData.parentid, 10);
          const releaseid = parseInt(toData.releaseid, 10);

          data.parentId = parentid;
          data.releaseId = releaseid;

          if (fromType !== 'subtask') {
            data.labelId = 0;
            data.type = 'subtask';
          }
          break;
        }
        default:
          break;
      }

      const newCardList = cardList.slice();
      const oldCard = newCardList.find(card => card.id === id);
      const newCard = Object.assign({}, oldCard);
      let updatedDatas = [data];

      // 更新拖拉的card的資料
      Object.keys(data).forEach(key => {

        if (data[key] === null) {

          if (key in newCard) {
            delete newCard[key];
          }
        } else {
          newCard[key] = data[key];
        }
      });

      let newListIds = [];

      if (newCard.type === 'task') {
        newListIds = taskCardIds(newCard.parentId);

      } else if (newCard.type === 'subtask') {
        newListIds = subtaskCardIds(newCard.parentId, newCard.releaseId);
      }

      const newNextCardId = newListIds[evt.newIndex] || null;
      const oldNextCard = newCardList.find(card => card.prevId === id);

      if (oldNextCard) {
        updatedDatas.push({
          id: oldNextCard.id,
          prevId: 'prevId' in oldCard ? oldCard.prevId : null
        });
      }

      if (newNextCardId === null) {
        data.prevId = newListIds[newListIds.length - 1] || null;
      } else {
        const newNextCard = newCardList.find(card => card.id === newNextCardId);

        // 表示仍在原本的list且僅跟後面一張card互換位子而已
        if (newNextCard.prevId === id && fromData.name === toData.name) {
          data.prevId = newNextCardId;
        } else {
          data.prevId = newNextCard.prevId || null;

          updatedDatas.push({
            id: newNextCardId,
            prevId: id
          });
        }
      }

      this.$store.dispatch('updateCardPos', updatedDatas);
    },
    onMove (evt) {
      const { draggedContext, from, to } = evt;
      const fromData = from.dataset;
      const toData = to.dataset;
      const fromType = fromData.type;
      const toType = toData.type;
      const fromParentId = parseInt(fromData.parentid, 10);
      const toParentId = parseInt(toData.parentid, 10);
      const draggedId = draggedContext.element;

      /* handle effect start */
      if (fromType === 'task') {
        this.draggedId = draggedId;
      }

      if (toType === 'task') {
        this.fillParentId = toParentId;
        this.fillIndex = draggedContext.futureIndex;
      }
      /* handle effect end */

      if (fromType !== 'subtask' && fromType !== toType) {
        const hasChild = this.$store.getters.cardList.find(value => value.parentId === draggedId);

        if (hasChild) {
          return false;
        }
      }

      // does change board width
      if (fromType === 'task' && toType === 'subtask') {
        const activityIndex = this.activityCardIds.indexOf(fromParentId);

        this.addWidthIndex = null;
        this.subtractWidthIndex = activityIndex;
      } else if (fromType === 'task' && toType === 'task') {
        const draggedActivityIndex = this.activityCardIds.indexOf(fromParentId);
        const relatedActivityIndex = this.activityCardIds.indexOf(toParentId);

        if (draggedActivityIndex !== relatedActivityIndex) {

          if (this.taskCardIds(parseInt(toParentId, 10)).length) {
            this.addWidthIndex = relatedActivityIndex;
          } else {
            this.addWidthIndex = null;
          }

          this.subtractWidthIndex = draggedActivityIndex;
        } else {
          this.addWidthIndex = null;
          this.subtractWidthIndex = null;
        }
      } else if (fromType === 'subtask' && toType === 'task') {
        const activityIndex = this.activityCardIds.indexOf(toParentId);

        if (this.taskCardIds(parseInt(toParentId, 10)).length) {
          this.addWidthIndex = activityIndex;
        } else {
          this.addWidthIndex = null;
        }

        this.subtractWidthIndex = null;
      } else {
        this.addWidthIndex = null;
        this.subtractWidthIndex = null;
      }

      return true;
    },
    calcWidth (width, index) {
      let _width = width;

      if (index === this.addWidthIndex) {
        _width += 128;
      } else if (index === this.subtractWidthIndex) {
        _width -= 128;
      }
      return Math.max(_width, defaultWidth);
    },
    addRelease () {
      this.$store.dispatch('addRelease', {
        title: this.title,
        order: this.createReleaseOrder
      });

      const duplIndex = this.releaseList.findIndex(value => value.order === this.createReleaseOrder);

      if (duplIndex !== -1) {
        const updateRelease = this.releaseList.slice(duplIndex).map(value => {
          value.order += 1;
          return value;
        });

        this.$store.dispatch('updateRelease', updateRelease);
      }

      this.createReleaseIndex = null;
      this.createReleaseOrder = null;
      this.isFocus = false;
      this.newRelease = '';
    },
    setCreateReleasePos (index, pos) {
      const order = this.releaseList[index].order;
      console.log('index', index, order);
      this.createReleaseIndex = pos === 'above' ? index - 1 : index;
      this.createReleaseOrder = pos === 'above' ? order : order + 1;
      this.isFocus = true;
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

.release-title:last-child {
  flex: 1;
  border-right: 0;
}
</style>

<style>
/* overwrite iview style start*/
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

.activity-card .empty-title {
  color: #5eb3d3;
}

.task-card .empty-title {
  color: #c9b50d;
}

.subtask-card .empty-title {
  color: #cecece;
}

.focus {
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.2);
}

.chosen {
  opacity: 1;
  background-color: red;
}

.ghost {
  background-color: #efefef;
  border: 1px dotted #000;
}

.ghost.card p,
.ghost.card .label-dropdown {
  display: none;
}
</style>
