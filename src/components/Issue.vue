<template>
  <div @click="openCard">
    <Card style="width: 100%; min-height: 80px; margin-bottom: 20px;">

      <div>
        <Tag v-for="label in issue.labels" :color="label.color" :key="label.name">{{ label.name }}</Tag>
      </div>

      <p>#{{ issue.number }} {{ title }}</p>
<!--       <p v-if="!isEdit">
        {{ title }}
        <Icon type="edit" @click.prevent.stop="toggle"></Icon>
      </p> -->
<!--       <p v-else>
        <Input type="text" v-model="title" />
        <Button style="margin: 20px 0" @click="save(issue.number, {title: title})">Save</Button>
        <Button style="margin: 20px 0" @click="toggle">Cancel</Button>
      </p> -->

      <!-- <p>#{{ issue.number }} opened on {{ issue.created_at }} by {{ issue.user }}</p> -->
    </Card>

    <Modal
      v-model="modal1"
      title="Edit issue">
      <div class="title">
        <h3>Title</h3>
        <span>#{{ issue.number }}</span>
        <Input style="width: 95%" type="text" v-model="title" placeholder="Title" />
        <Button style="margin-top: 10px" type="success" :loading="loading2" @click="updateIssue">Update</Button>
      </div>

      <Row style="margin-top: 20px">
        <Col span="12">
          <h3>Member</h3>
          <div v-for="assignee in issue.assignees" :key="assignee">{{ assignee }}</div>

          <Button style="margin-top: 10px" type="success" :loading="loading2" @click="updateIssue">Edit</Button>
        </Col>

        <Col span="12">
          <h3>Project</h3>
          <div>Backend project</div>

          <Button style="margin-top: 10px" type="success" :loading="loading2" @click="updateIssue">Edit</Button>
        </Col>
      </Row>

      <Row style="margin-top: 20px">
        <Col span="12">
          <h3>Label</h3>
          <Tag v-for="label in issue.labels" :color="label.color" :key="label.name">{{ label.name }}</Tag>
        </Col>

        <Col span="12">
          <h3>Milestone</h3>
          <div>{{ issue.milestone }}</div>
        </Col>
      </Row>

      <div class="desc" style="margin-top: 20px;">
        <h3>Description</h3>
        <Input type="textarea" v-model="body" :rows="2" placeholder="Title" />
        <Button style="margin-top: 10px" type="success" :loading="loading2" @click="updateIssue">Update</Button>
      </div>

      <div class="comments" style="margin-top: 20px;">
        <h3>Comments</h3>
        <div v-for="(comment, index) in comments" class="comment" style="margin-top: 10px;" :key="comment.id">
          <h4>{{ comment.author }}:</h4>
          <Input type="textarea" v-model="bodies[index]" :rows="2" placeholder="Leave a comment" />
          <Button style="margin-top: 10px" @click="updateComment(comment.id, index)">
            Save
          </Button>
          <Button style="margin-top: 10px" @click="deleteComment(comment.id, index)">
            Delete
          </Button>
        </div>
      </div>

      <div style="margin-top: 20px;">
        <h3>Write comment</h3>
        <Input type="textarea" v-model="comment" :rows="2" placeholder="Title" />
        <Button style="margin-top: 10px" type="success" :loading="loading2" @click="createComment">
          Add comment
        </Button>
      </div>

      <div slot="footer">
        <Button type="error" :loading="loading1" @click="closeIssue">
          Close issue
        </Button>
      </div>

    </Modal>
  </div>
</template>

<script>
import axios from 'axios';
import { token, githubApi } from '../../data';

export default {
  name: 'Issue',
  props: ['issue'],
  data () {
    return {
      isEdit: false,
      title: this.issue.title,
      body: this.issue.body,
      comments: [],
      bodies: [],
      comment: '',
      modal1: false,
      loading1: false,
      loading2: false
    };
  },
  methods: {
    toggle (e) {
      this.isEdit = !this.isEdit;
    },
    openCard () {
      this.modal1 = true;

      if (this.issue.commentCount > 0) {
        this.getComments();
      }
    },
    getComments () {
      axios({
        method: 'get',
        url: this.issue.comments_url,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      })
      .then((response) => {
        const bodies = [];

        this.comments = response.data.map((value) => {
          bodies.push(value.body);

          return {
            id: value.id,
            author: value.user.login,
            body: value.body
          };
        });

        this.bodies = bodies;
        // this.loading1 = false;
        // this.modal1 = false;
        // this.$Message.info('Close issue successfully');
      }, (error) => {
        // this.loading1 = false;
        // this.$Message.info('Close issue failed');
        console.log('error', error);
      });
    },
    closeIssue () {
      this.loading1 = true;
      axios({
        method: 'patch',
        url: `${githubApi}/issues/${this.issue.number}`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: {
          state: 'closed'
        }
      })
      .then((response) => {
        this.loading1 = false;
        this.modal1 = false;
        this.$Message.info('Close issue successfully');
      }, (error) => {
        this.loading1 = false;
        this.$Message.info('Close issue failed');
        console.log('error', error);
      });
    },
    updateIssue () {
      this.loading2 = true;
      axios({
        method: 'patch',
        url: `${githubApi}/issues/${this.issue.number}`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: {
          title: this.title,
          body: this.body
        }
      })
      .then((response) => {
        this.loading2 = false;
        this.modal1 = false;
        this.$Message.success('Update issue successfully');
      }, (error) => {
        this.loading2 = false;
        this.$Message.error('Update issue failed');
        console.log('error', error);
      });
    },
    updateComment (id, index) {
      this.loading2 = true;
      axios({
        method: 'patch',
        url: `${githubApi}/issues/comments/${id}`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: {
          body: this.bodies[index]
        }
      })
      .then((response) => {
        // this.loading2 = false;
        // this.modal1 = false;
        this.$Message.success('Update comment successfully');
      }, (error) => {
        // this.loading2 = false;
        this.$Message.error('Update comment failed');
        console.log('error', error);
      });
    },
    createComment () {
      axios({
        method: 'post',
        url: `${githubApi}/issues/${this.issue.number}/comments`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: {
          body: this.comment
        }
      })
      .then((response) => {
        // this.loading2 = false;
        // this.modal1 = false;
        this.comments.push({
          id: response.data.id,
          author: response.data.user.login,
          body: response.data.body
        });
        this.bodies.push(this.comment);

        this.comment = '';
        this.$Message.success('Create comment successfully');
      }, (error) => {
        // this.loading2 = false;
        this.$Message.error('Create comment failed');
        console.log('error', error);
      });
    },
    deleteComment (id, index) {
      axios({
        method: 'delete',
        url: `${githubApi}/issues/comments/${id}`,
        headers: {
          Authorization: `token ${token}`
        }
      })
      .then((response) => {
        // this.loading2 = false;
        // this.modal1 = false;
        this.comments.splice(index, 1);
        this.bodies.splice(index, 1);
        this.$Message.success('Delete comment successfully');
      }, (error) => {
        // this.loading2 = false;
        this.$Message.error('Delete comment failed');
        console.log('error', error);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
