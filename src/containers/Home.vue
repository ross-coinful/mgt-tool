<template>
  <div class="home">
    <h1>{{ msg }} {{ testData }}</h1>

    <Button style="margin: 20px 0" icon="plus-round" @click="modal1 = true">
      Add new issue
    </Button>
    <Modal
      v-model="modal1"
      title="Create a new issue"
      @on-ok="addTask">
      <div>
        <Input type="text" v-model="title" placeholder="Title"></Input>
      </div>
      <Input v-model="comment" type="textarea" :rows="4" placeholder="Leave a comment"></Input>
    </Modal>

    <Button style="margin: 20px 0" icon="refresh" @click="getIssues">
      Update issues
    </Button>

    <Tabs value="name1">
      <TabPane label="Label" name="name1">
        <LabelBoard :issues="issues" />
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
import LabelBoard from '@/components/LabelBoard';
import ProjectBoard from '@/components/ProjectBoard';
import MilestoneBoard from '@/components/MilestoneBoard';
import { githubApi, localServer } from '../../data';

export default {
  name: 'Home',
  data () {
    return {
      milestones: [],
      issues: [],
      msg: 'Welcome to Your Management Tool',
      modal1: false,
      title: '',
      comment: '',
      testData: ''
    };
  },
  components: {
    LabelBoard: LabelBoard,
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
      this.testServer();
    },
    testServer () {
      axios({
        method: 'get',
        url: `${localServer}/suggest`
      })
      .then((response) => {
        this.testData = response.data;
      }, (error) => {
        console.log('testServer error', error);
      });
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
        url: `${localServer}/issues`
      })
      .then((response) => {
        this.issues = response.data.map((value) => {

          value.labels = value.labels.map((label) => {
            label.color = '#' + label.color.toUpperCase();
            return label;
          });

          value.assignees = value.assignees.map((assignee) => {
            return assignee.login;
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
            milestone: value.milestone ? value.milestone.number : null,
            assignees: value.assignees
          };
        });
      }, (error) => {
        console.log('getIssues error', error);
      });
    },
    addTask () {
      axios({
        method: 'post',
        url: `${localServer}/issues`,
        data: {
          title: this.title,
          body: this.comment
        }
      })
      .then((response) => {
        console.log('add task success', response, response.data);
        // this.testData = response.data;
      }, (error) => {
        console.log('add task  error', error);
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
