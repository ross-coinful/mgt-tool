<template>

  <div>
    <div class="board" v-for="milestone in milestones" :key="milestone.id">
      <p>{{ milestone.title }}</p>
      <p>{{ milestone.due_on }}</p>
      <Issue v-for="issue in issuesFilter(milestone.number)" :issue="issue" :key="issue.number"></Issue>
    </div>

    <div class="board">
      <p>Others</p>
      <Issue v-for="issue in otherIssues()" :issue="issue" :key="issue.number"></Issue>
    </div>
  </div>

</template>

<script>
import Issue from '@/components/Issue';

export default {
  name: 'MilestoneBoard',
  props: ['issues', 'milestones'],
  data () {
    return {
      modal1: false,
      title: '',
      comment: '',
      indexs: [] // already show
    };
  },
  components: {Issue: Issue},
  methods: {
    issuesFilter (number) {
      return this.issues.filter((issue, index) => {

        if (!issue.milestone || issue.milestone.number !== number) {
          return false;
        }

        if (this.indexs.indexOf(index) === -1) {
          this.indexs.push(index);
        }

        // console.log('issuesFilter this,indexs', this.indexs);

        return true;
      });
    },
    otherIssues () {
      // console.log('this,indexs', this.indexs);
      return this.issues.filter((issue, index) => {
        return this.indexs.indexOf(index) === -1;
      });
    }
  }
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
