<template>

  <div class="board">
    <p>CI</p>
    <Issue v-for="issue in issues" :issue="issue" :key="issue.number"></Issue>
  </div>

</template>

<script>
import Issue from '@/components/Issue';

export default {
  name: 'ProjectBoard',
  props: ['issues', 'milestones'],
  data () {
    return {
      modal1: false,
      title: '',
      comment: ''
    };
  },
  components: {Issue: Issue}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board {
  width: 300px;
  padding: 20px;
  margin-left: 20px;
  float: left;
  background-color: #EAEAEA;
}
</style>
