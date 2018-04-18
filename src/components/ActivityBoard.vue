<template>
  <div class="activity-board board">
    <div v-if="isShrink" class="shrink-card">
      <span @click="expandCard">
        <Icon type="plus" size="16"></Icon>
      </span>
      <span v-html="splitTitle" class="text"></span>
    </div>
    <div v-else class="board-body">
      <!-- <draggable class="activity-board" :options="{group:'card'}"> -->
      <ActivityCard :id="parentId"></ActivityCard>
      <!-- </draggable> -->

      <draggable
        class="task-board"
        :options="dragOptions"
        data-type="task"
        :data-parentid="parentId"
        :data-name="listName"
        @end="onEnd"
        :list="taskCardIds"
        :move="onMove"
      >
        <TaskCard v-for="(id, index) in taskCardIds" :id="id" :index="index" :key="id" />
        <NewCard type="task" :parentId="parentId" :taskNumber="taskCardIds.length" />
      </draggable>
    </div>

  </div>
</template>

<script>
import ActivityCard from '@/components/ActivityCard';
import TaskCard from '@/components/TaskCard';
import NewCard from '@/components/NewCard';
import draggable from 'vuedraggable';
import store from '../stores';
import { dragOptions } from '../../data';

export default {
  name: 'ActivityBoard',
  props: {
    isShrink: {
      type: Boolean,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    parentId: {
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
  computed: {
    splitTitle () {
      return this.$store.getters.card(this.parentId).title.split('').reduce((sum, cur) => { return sum + `${cur}<br />`; }, '');
    },
    taskCardIds () {
      return this.$store.getters.taskCardIds(this.parentId);
    },
    listName () {
      return `task-list-${this.parentId}`;
    }
  },
  components: {
    ActivityCard,
    TaskCard,
    NewCard,
    draggable
  },
  data () {
    return {
      addWidth: 0,
      dragOptions
    };
  },
  methods: {
    expandCard () {
      this.$store.dispatch('expandCard', this.parentId);
    },
    openCard () {
      this.$store.dispatch('openCard');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.activity-board {
  position: relative;
}

.board-body {
  height: 100%;
}

.task-board {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 86px;
}

.shrink-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 20px;
  height: 164px;
  margin: 8px;
  padding-top: 6px;
  background-color: #aed9e9;
}

.shrink-card .text {
  height: 130px;
  overflow: hidden;
  text-align: center;
}

.add-card {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
