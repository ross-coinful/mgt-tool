<template>
  <div>
    <Card style="width: 100%">
      <p v-if="!isEdit" @click="modal1 = true">
        {{ title }}
        <Button style="margin: 20px 0" @click="toggle">Edit</Button>
      </p>
      <p v-else>
        <input type="text" v-model="title">
        <Button style="margin: 20px 0" @click="save(issue.number, {title: title})">Save</Button>
        <Button style="margin: 20px 0" @click="toggle">Cancel</Button>
      </p>
      <span v-for="label in issue.labels" :key="label.name">
        <Tag v-bind:color="label.color">{{ label.name }}</Tag>
      </span>
      <p>#{{ issue.number }} opened on {{ issue.created_at }} by {{ issue.user }}</p>
    </Card>
    <Modal
      v-model="modal1"
      title="Common Modal dialog box title"
      @on-cancel="save(issue.number, {state: 'closed'})">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
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
      modal1: false
    };
  },
  methods: {
    toggle: function () {
      this.isEdit = !this.isEdit;
    },
    save: function (number, data) {
      axios({
        method: 'patch',
        url: `${githubApi}/issues/${number}`,
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        data: data
      })
      .then((response) => {
        this.toggle();
      }, (error) => {
        // this.loading = false;
        console.log('edit-error', error);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
