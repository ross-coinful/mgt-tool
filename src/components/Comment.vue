<template>
  <div class="comment" :id="id">
    <img class="avatar" :src="avatar" />
    <div class="comment-box">
      <div class="comment-info">
        <span class="member">{{ user }}</span>
        <span class="time">commented at {{ time }}</span>
        <span v-if="username === user" class="edit-btn" @click="focusComment">
          <Icon type="edit"></Icon>
        </span>
        <span v-if="username === user"  class="del-btn" @click="deleteComment">
          <Icon type="trash-a"></Icon>
        </span>
      </div>
      <div class="comment-content" v-if="!isFocus">
        {{ body }}
      </div>
      <textarea class="comment-input" v-else v-model="comment" @blur="blurComment" v-focus="isFocus"></textarea>
    </div>
  </div>
</template>

<script>
import store from '../stores';

export default {
  name: 'Comment',
  props: {
    id: {
      type: Number,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  },
  store,
  data () {
    return {
      isFocus: false,
      comment: ''
    };
  },
  computed: {
    username () {
      const { user } = this.$store.state.user;

      return user ? user.name : '';
    }
  },
  methods: {
    focusComment () {
      this.isFocus = true;
      this.comment = this.body;
    },
    blurComment () {
      if (this.initialComment !== this.comment) {
        this.$store.dispatch('updateCard', {
          id: this.$store.state.card.focusId,
          commentId: this.id,
          body: this.comment
        });
      }
      this.isFocus = false;
    },
    deleteComment () {
      this.$Modal.confirm({
        title: 'Confirmation',
        content: 'Are you sure you want to delete this comment?',
        okText: 'ok',
        cancelText: 'cancel',
        onOk: () => {
          this.$store.dispatch('updateCard', {
            id: this.$store.state.card.focusId,
            commentId: this.id,
            body: null
          });
        }
      });

    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.comment-info {
  position: relative;
}

.edit-btn {
  position: absolute;
  right: 30px;
  cursor: pointer;
}

.del-btn {
  position: absolute;
  right: 5px;
  font-size: 16px;
  cursor: pointer;
}

.del-btn[disabled],
.edit-btn[disabled] {
  color: #bbb;
  pointer-events: none;
}
</style>
