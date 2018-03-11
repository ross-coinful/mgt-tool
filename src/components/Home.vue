<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <h2>Click the button to get github issues</h2>

    <Button style="margin: 20px 0" @click="modal1 = true">
      Add new issue
      <Icon type="plus-round"></Icon>
    </Button>
    <Modal
      v-model="modal1"
      title="Create a new issue"
      @on-ok="add">
      <textarea v-model="newIssue">
      </textarea>
    </Modal>

    <Button style="margin: 20px 0" @click="get">Get issues</Button>
    <Row :gutter="16" v-for="i in Math.ceil(issues.length / 4)" :key="i">
      <Col span="6" v-for="issue in issues.slice((i - 1) * 4, i * 4)" :key="issue.title">
        <Issue v-bind:issue="issue"></Issue>
      </Col>
    </Row>

  </div>
</template>

<script>
import axios from 'axios';
import Issue from '@/components/Issue';
import { token, githubApi } from '../../data';

export default {
  name: 'Home',
  data () {
    return {
      issues: [],
      msg: 'Welcome to Your Management Tool',
      modal1: false,
      newIssue: 'new issue'
    };
  },
  components: {Issue: Issue},
  mounted () {
    this.get();
    console.log('mounted');
  },
  methods: {
    get: function () {
      this.loading = true;
      axios({
        method: 'get',
        url: `${githubApi}/issues`
      })
      .then((response) => {
        // this.loading = false;
        this.issues = response.data.map((value) => {

          value.labels = value.labels.map((label) => {
            label.color = '#' + label.color.toUpperCase();
            return label;
          });

          return {
            labels: value.labels,
            title: value.title,
            number: value.number,
            created_at: value.created_at,
            user: value.user.login
          };
        });

      }, (error) => {
        // this.loading = false;
        console.log('error', error);
      });
    },
    add: function () {
      this.loading = true;
      axios({
        method: 'post',
        url: `${githubApi}/issues`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: {
          title: this.newIssue
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
