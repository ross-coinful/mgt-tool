<template>

  <div class="board-body" :style="style">

  <!-- v-for taskIndexs 的長度 -->

    <draggable
      v-for="id in taskCardIds"
      class="subtask-list"
      :options="{group:'card'}"
      :key="id"
      data-type="subtask"
      :data-grandparentid="parentId"
      :data-parentid="id"
      :data-releaseid="releaseId"
      @end="onEnd"
    >
      <SubTaskCard
        v-for="id in subtaskCardIds(id)"
        :id="id"
        :key="id"
      />
      <NewCard
        type="subtask"
        :grandParentId="parentId"
        :parentId="id"
        :releaseId="releaseId"
      />
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
    parentId: {
      type: Number,
      required: false
    },
    releaseId: {
      type: Number,
      required: true
    },
    onEnd: {
      type: Function,
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
    taskCardIds () {
      return this.$store.getters.taskCardIds(this.parentId);
    }
  },
  methods: {
    subtaskCardIds (taskId) { // 下面的函數參數為 (grandParentId, parentId, releaseId)
      return this.$store.getters.subtaskCardIds(this.parentId, taskId, this.releaseId);
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
