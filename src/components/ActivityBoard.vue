<template>

  <div class="board-body" :style="style">
    <div class="activity-board">
      <ActivityCard :id="id" :index="activityIndex"></ActivityCard>
    </div>

    <div class="task-board">
      <TaskCard v-for="(id, index) in taskCardIds" :id="id" :index="index" :key="id"></TaskCard>
    </div>
  </div>

</template>

<script>
import ActivityCard from '@/components/ActivityCard';
import TaskCard from '@/components/TaskCard';
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
    }
  },
  store,
  computed: {
    style () {
      return 'width: ' + this.width + 'px';
    },
    taskCardIds () {
      return this.$store.getters.taskCardIds(this.activityIndex);
    }
  },
  components: {
    ActivityCard: ActivityCard,
    TaskCard: TaskCard
  },
  methods: {
    openCard () {
      console.log('try open');
      this.$store.dispatch('openCard');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task-board {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
