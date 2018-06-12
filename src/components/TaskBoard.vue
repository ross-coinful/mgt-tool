<template>
  <li :class="setClass" :style="style">
    <div v-if="!isShrink" class="board-body">
      <div v-for="(id, index) in taskCardIds" class="subtask-list" :key="id">
        <div v-if="displaySpace(index)" style="width: 128px;height: 100%">

        </div>
        <draggable
          v-else
          :options="dragOptions"
          data-type="subtask"
          :data-parentid="id"
          :data-releaseid="releaseId"
          :data-name="listName(id)"
          @end="onEnd"
          :list="subtaskCardIds(id)"
          :move="onMove"
        >
          <SubTaskCard
            v-if="display(id)"
            v-for="subtaskId in subtaskCardIds(id)"
            :id="subtaskId"
            :key="subtaskId"
          />
          <NewCard
            v-if="display(id)"
            type="subtask"
            :parentId="id"
            :releaseId="releaseId"
          />
        </draggable>
      </div>
    </div>
  </li>
</template>

<script>
import SubTaskCard from '@/components/SubTaskCard';
import NewCard from '@/components/NewCard';
import draggable from 'vuedraggable';
import { dragOptions } from '../../data';

export default {
  name: 'TaskBoard',
  props: {
    width: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      required: false
    },
    releaseId: {
      type: Number,
      required: true
    },
    draggedId: {
      type: Number
    },
    fillSpace: {
      type: Boolean,
      required: true
    },
    fillIndex: {
      type: Number
    },
    index: {
      type: Number,
      required: true
    },
    onEnd: {
      type: Function,
      required: true
    },
    onMove: {
      type: Function,
      required: true
    },
    isShrink: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      show: false,
      dragOptions
    };
  },
  computed: {
    style () {
      // const noSubtask = this.$store.state.card.cardList.every(card => card.type !== 'subtask');
      // const isUnscheduledRelease = this.releaseId === 0;
      // const height = isUnscheduledRelease && noSubtask ? 'height: calc(100vh - 265px);' : '';

      return 'width: ' + this.width + 'px';
    },
    setClass () {
      return `task-board board ${this.isShrink ? 'shrink' : ''}`;
    },
    taskCardIds () {
      const taskCardIds = this.$store.getters.taskCardIds(this.parentId);

      if (this.fillSpace && this.fillIndex !== null && this.fillIndex < taskCardIds.length) {
        taskCardIds.splice(this.fillIndex, 0, null);
      }
      return taskCardIds;
    }
  },
  methods: {
    subtaskCardIds (taskId) {
      return this.$store.getters.subtaskCardIds(taskId, this.releaseId);
    },
    listName (id) {
      return `subtask-list-${id}-${this.releaseId}`;
    },
    display (id) {
      return id !== this.draggedId;
    },
    displaySpace (index) {
      return this.fillSpace && this.fillIndex === index;
    }
  },
  components: {
    SubTaskCard,
    NewCard,
    draggable
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hidden {
  display: none;
}

.task-board.shrink {
  min-height: 22px;
}

.board-body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  margin-bottom: 15px;
  min-height: 94px;
}

.subtask-list {
  position: relative;
  width: 128px;
}
</style>
