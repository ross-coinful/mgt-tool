<template>
  <div style="position: relative" @mouseover="show = true" @mouseout="show = false">
    <div class="board-body" :style="style">
      <draggable class="activity-board" :options="{group:'card'}">
        <ActivityCard :id="id" :index="activityIndex"></ActivityCard>
      </draggable>

      <draggable class="task-board" :options="{group:'card'}">
        <TaskCard v-for="(id, index) in taskCardIds" :id="id" :index="index" :key="id"></TaskCard>
        <NewCard v-if="checkCreate" type="task"></NewCard>
      </draggable>
    </div>

    <div v-show="show" class="add-card" @click="createCard">
      <Icon type="plus-circled" size="16"></Icon>
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
  data () {
    return {
      show: false
    };
  },
  computed: {
    style () {
      return 'width: ' + this.width + 'px';
    },
    checkCreate () {
      const { createCard, createType, createIndexs } = this.$store.state.card;
      const { activityIndex } = createIndexs;

      console.log('createCard', createCard, activityIndex);

      return createCard && createType === 'task' && activityIndex === this.activityIndex;
    }
    // isCreate () {
    //   const { isCreate, createType, createIndexs } = this.$store.state.card;

    //   return isCreate && createType === 'task' && createIndexs.activityIndex === this.activityIndex;
    // }
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
    },
    createCard () {
      const data = {
        type: 'task',
        activityIndex: this.activityIndex,
        taskIndex: this.taskCardIds.length
      };

      this.$store.dispatch('createCard', data);
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

.add-card {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
