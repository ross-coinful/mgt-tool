<template>
  <div style="position: relative">
    <div class="board-body">
      <!-- <draggable class="activity-board" :options="{group:'card'}"> -->
      <ActivityCard :id="parentId"></ActivityCard>
      <!-- </draggable> -->

      <draggable
        class="task-board"
        :options="{group:'card'}"
        data-type="task"
        :data-parentid="parentId"
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

export default {
  name: 'ActivityBoard',
  props: {
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
    taskCardIds () {
      return this.$store.getters.taskCardIds(this.parentId);
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
      addWidth: 0
    };
  },
  methods: {
    openCard () {
      this.$store.dispatch('openCard');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board-body {
  height: 100%;
}

.task-board {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
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
