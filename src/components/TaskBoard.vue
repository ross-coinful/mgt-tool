<template>
  <div :class="setClass" :style="style">
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
  </div>
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
/*.board-title {
  padding: 4px;
  border-right: 1px dotted #bbb;
  border-bottom: 1px dotted #bbb;*/

  /* dotted border right */
/*  background-image: linear-gradient(black 33%, rgba(255,255,255,0) 0%);
  background-position: right;
  background-size: 1px 3px;
  background-repeat: repeat-y;*/

  /* dotted border bottom */
/*  background-image: linear-gradient(to right, #aaa 20%, rgba(255, 255, 255, 0) 0%);
  background-position: bottom;
  background-size: 3px 1px;
  background-repeat: repeat-x;*/
/*}*/
.hidden {
  display: none;
}

.task-board {
  display: flex;
  flex-direction: column;
  min-height: 94px;
}

.task-board.shrink {
  min-height: 22px;
}

.board-body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  padding-right: 0;
  padding-bottom: 15px;
}

.subtask-list {
  position: relative;
  width: 128px;
}
</style>
