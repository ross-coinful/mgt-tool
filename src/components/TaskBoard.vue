<template>

  <div class="board-body" :style="style">

  <!-- v-for taskIndexs 的長度 -->
    <div class="subtask-list">
      <SubTaskCard :id="4"></SubTaskCard>
    </div>

    <draggable v-model="list" class="subtask-list" :options="{group:'people'}">
      <SubTaskCard
        v-for="subtask in list"
        :id="subtask.id"
        :title="subtask.title"
        :key="subtask.id">
      </SubTaskCard>
    </draggable>

    <draggable v-model="list2" class="subtask-list" :options="{group:'people'}">
      <SubTaskCard
        v-for="subtask in list2"
        :id="subtask.id"
        :title="subtask.title"
        :key="subtask.id">
      </SubTaskCard>
    </draggable>
  </div>
</template>

<script>
import SubTaskCard from '@/components/SubTaskCard';
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
  computed: {
    style () {
      return 'width: ' + this.width + 'px';
    },
    subtaskCardIds () {
      return this.$store.getters.subtaskCardIds(this.activityIndex, this.releaseIndex);
    }
  },
  data () {
    return {
      list: [{
        title: 'title-1',
        id: 0
      }, {
        title: 'title-2',
        id: 1
      }, {
        title: 'title-3',
        id: 2
      }],
      list2: [{
        title: 'title-1-2',
        id: 3
      }, {
        title: 'title-2-2',
        id: 4
      }, {
        title: 'title-3-2',
        id: 5
      }]
    };
  },
  components: {
    SubTaskCard,
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
</style>
