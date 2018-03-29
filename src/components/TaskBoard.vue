<template>
  <div class="task-board" :style="style">
    <div class="release-title">
      <span v-if="index === 0">{{ releaseTitle }}</span>
    </div>
    <div class="board-body">

      <draggable
        v-for="id in taskCardIds"
        class="subtask-list"
        :options="dragOptions"
        :key="id"
        data-type="subtask"
        :data-parentid="id"
        :data-releaseid="releaseId"
        @end="onEnd"
        :list="subtaskCardIds(id)"
        :move="onMove"
      >
        <SubTaskCard
          v-for="id in subtaskCardIds(id)"
          :id="id"
          :key="id"
        />
        <NewCard
          type="subtask"
          :parentId="id"
          :releaseId="releaseId"
        />
      </draggable>

    </div>
  </div>
</template>

<script>
import SubTaskCard from '@/components/SubTaskCard';
import NewCard from '@/components/NewCard';
import draggable from 'vuedraggable';
import store from '../stores';
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
    releaseTitle: {
      type: String,
      required: true
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
    }
  },
  store,
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
    taskCardIds () {
      return this.$store.getters.taskCardIds(this.parentId);
    }
  },
  methods: {
    subtaskCardIds (taskId) {
      return this.$store.getters.subtaskCardIds(taskId, this.releaseId);
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

.task-board {
  display: flex;
  flex-direction: column;
}

.board-body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  padding-right: 0;
}

.subtask-list {
  position: relative;
  width: 128px;
}

.release-title {
  height: 21px;
  padding-left: 8px;
  border-right: 1px dotted #bbb;
  border-bottom: 1px dotted #bbb;
  color: #66b9e1;
  font-size: 14px;
}
</style>
