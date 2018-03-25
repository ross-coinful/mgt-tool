<template>
  <div style="position: relative">
    <div class="board-body" :style="style">
      <draggable class="activity-board" :options="{group:'card'}">
        <ActivityCard :id="id" :index="activityIndex"></ActivityCard>
      </draggable>

      <draggable class="task-board" :options="{group:'card'}">
        <TaskCard v-for="(id, index) in taskCardIds" :id="id" :index="index" :key="id"></TaskCard>
        <NewCard type="task" :activityIndex="activityIndex" :taskIndex="taskCardIds.length"></NewCard>
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
    id: {
      type: Number,
      required: true
    },
    activityIndex: {
      type: Number,
      required: true
    },
    taskCardIds: {
      type: Array,
      required: true
    }
  },
  store,
  computed: {
    style () {
      return 'width: ' + this.width + 'px';
    }
  },
  components: {
    ActivityCard,
    TaskCard,
    NewCard,
    draggable
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
