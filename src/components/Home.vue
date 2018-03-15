<template>
  <div class="home">
    <h1>{{ msg }}</h1>

    <Button style="margin: 20px 0" icon="plus-round" @click="modal1 = true">
      Add new issue
    </Button>
    <Modal
      v-model="modal1"
      title="Create a new issue"
      @on-ok="add">
      <div>
        <Input type="text" v-model="title" placeholder="Title"></Input>
      </div>
      <Input v-model="comment" type="textarea" :rows="4" placeholder="Leave a comment"></Input>
    </Modal>

    <Button style="margin: 20px 0" icon="refresh" @click="getIssues">
      Update issues
    </Button>

    <Tabs value="name1">
      <TabPane label="Time" name="name1">
        <TimeBoard :issues="issues" />
      </TabPane>
      <TabPane label="Project" name="name2">
        <ProjectBoard :issues="issues" />
      </TabPane>
      <TabPane label="Milestone" name="name3">
        <MilestoneBoard :issues="issues" :milestones="milestones" />
      </TabPane>
    </Tabs>

  </div>
</template>

<script>
import axios from 'axios';
import TimeBoard from '@/components/TimeBoard';
import ProjectBoard from '@/components/ProjectBoard';
import MilestoneBoard from '@/components/MilestoneBoard';
import { token, githubApi } from '../../data';

export default {
  name: 'Home',
  data () {
    return {
      milestones: [],
      issues: [],
      msg: 'Welcome to Your Management Tool',
      modal1: false,
      title: '',
      comment: ''
    };
  },
  components: {
    TimeBoard: TimeBoard,
    ProjectBoard: ProjectBoard,
    MilestoneBoard: MilestoneBoard
  },
  mounted () {
    this.initial();
    console.log('mounted');
  },
  methods: {
    initial () {
      this.getMilestones();
      this.getIssues();
    },
    getMilestones () {
      axios({
        method: 'get',
        url: `${githubApi}/milestones`
      })
      .then((response) => {
        this.milestones = response.data;
      }, (error) => {
        console.log('getMilestones error', error);
      });
    },
    getIssues () {
      axios({
        method: 'get',
        url: `${githubApi}/issues`
      })
      .then((response) => {
        this.issues = response.data.map((value) => {

          value.labels = value.labels.map((label) => {
            label.color = '#' + label.color.toUpperCase();
            return label;
          });

          return {
            labels: value.labels,
            title: value.title,
            body: value.body,
            commentCount: value.comments,
            comments_url: value.comments_url,
            number: value.number,
            created_at: value.created_at,
            user: value.user.login,
            milestone: value.milestone
          };
        });
      }, (error) => {
        console.log('getIssues error', error);
      });
    },
    add () {
      axios({
        method: 'post',
        url: `${githubApi}/issues`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: {
          title: this.title,
          body: this.comment
        }
      })
      .then((response) => {

      }, (error) => {
        console.log('add issue error', error);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.home {
  text-align: center;
}
.ivu-tag-text {
  color: #000 !important;
}
</style>
