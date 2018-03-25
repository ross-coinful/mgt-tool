<template>

  <div class="board-body" :style="style">

  <!-- v-for taskIndexs 的長度 -->

    <draggable
      v-for="(i, index) in taskCardNumber"
      class="subtask-list"
      :options="{group:'card'}"
      :key="i"
      :data-index="index"
      @end="onEnd">
      <SubTaskCard
        v-for="id in subtaskCardIds(index)"
        :id="id"
        :key="id">
      </SubTaskCard>
      <NewCard
        type="subtask"
        :activityIndex="activityIndex"
        :releaseIndex="releaseIndex"
        :taskIndex="index"
        :subtaskCardIds="subtaskCardIds">
      </NewCard>
    </draggable>

  </div>
</template>

<script>
import SubTaskCard from '@/components/SubTaskCard';
import NewCard from '@/components/NewCard';
import draggable from 'vuedraggable';
import store from '../stores';

export default {
  name: 'TaskBoard',
  props: {
    width: {
      type: Number,
      required: true
    },
    activityIndex: {
      type: Number,
      required: true
    },
    releaseIndex: {
      type: Number,
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
    taskCardNumber () {
      return this.$store.getters.taskCardNumber(this.activityIndex);
    }
  },
  methods: {
    subtaskCardIds (taskIndex) {
      return this.$store.getters.subtaskCardIds(this.activityIndex, this.releaseIndex, taskIndex);
    },
    onEnd (evt) {
      console.log('to', evt);
      const id = evt.item.dataset.id;
      const data = {
        taskIndex: parseInt(evt.to.dataset.index, 10),
        subtaskIndex: evt.newIndex
      };

      this.$store.dispatch('updateCard', {id, data});
      // const oldTaskIndex = evt.from.dataset.index;
      // const oldSubtaskIndex = evt.oldIndex;
      // console.log('id', id, `from ${oldTaskIndex}, ${oldSubtaskIndex}`,  `to ${newTaskIndex}, ${newSubtaskIndex}`);
      // this.$store.dispatch('updateCard');
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

.board-body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.subtask-list {
  position: relative;
  width: 128px;
}
</style>
