<template>
  <Modal
    v-model="$store.state.card.isOpen"
    width="800"
    @on-visible-change="visiableChange">
    <div class="modal-body">
      <div class="card-title">
        <p class="display" v-if="!isFocusTitle" @click="focusTitle" v-html="cardTitle"></p>
        <textarea class="input" v-else v-model="title" @blur="blurTitle" v-focus="isFocusTitle"></textarea>
      </div>
      <div class="content">
        <div class="card-detail">
          <p class="box-name">Description:</p>
          <p class="display" v-if="!isFocusDetail" @click="focusDetail" v-html="cardDetail"></p>
          <textarea class="input" v-else v-model="detail" @blur="blurDetail" v-focus="isFocusDetail"></textarea>
        </div>

        <Comment
          v-for="comment in comments"
          :id="comment.id"
          :avatar="comment.avatar"
          :user="comment.user"
          :time="comment.time"
          :body="comment.body"
          :key="comment.id"
        />

        <div class="comment write-comment">
          <img class="avatar" :src="avatar" />
          <textarea class="comment-input" v-model="comment" placeholder="Leave a comment"></textarea>
        </div>
        <Button type="success" class="comment-btn" :disabled="comment === ''" @click="addComment">Comment</Button>
      </div>

      <div class="setting">
        <CustomDropdown title="Assigness">
          <div
            class="checkbox-container"
            slot="menu"
            v-for="member in memberList"
            :key="member.id"
            :data_id="member.id"
            @click="changeActiveMember"
          >
            <DropdownItem>
              <Icon
                v-if="checkActiveMember(member.id)"
                type="android-checkbox"
                size="15"
              ></Icon>
              <Icon v-else type="android-checkbox-outline-blank" size="15"></Icon>
              {{ member.name }}
            </DropdownItem>
          </div>
          <span v-if="activeMember.length" slot="value">
            <p v-for="id in activeMember" :key="id">
              {{ memberList.find(value => value.id === id).name }}
            </p>
          </span>
          <span class="placeholder" v-else slot="value">
            None yet
          </span>
        </CustomDropdown>

        <CustomDropdown title="Repository">
          <div
            class="checkbox-container"
            slot="menu"
            v-for="repo in repoList"
            :key="repo.id"
            :data_owner="repo.owner.login"
            :data_repo="repo.name"
            @click="changeActiveRepo"
          >
            <DropdownItem>
              <Icon
                v-if="checkActiveRepo(repo)"
                type="android-checkbox"
                size="15"
              ></Icon>
              <Icon v-else type="android-checkbox-outline-blank" size="15"></Icon>
              {{ repo.full_name }}
            </DropdownItem>
          </div>
          <span v-if="activeRepo.owner && activeRepo.repo" slot="value">
            {{ activeRepo.owner }}/{{ activeRepo.repo }}
          </span>
          <span class="placeholder" v-else slot="value">
            None yet
          </span>
        </CustomDropdown>
      </div>
    </div>

    <div slot="footer">
      <Button type="text">add comment</Button>
      <span class="link-btn-separator">&nbsp;|&nbsp;</span>
      <Button type="text">add attachment</Button>
      <span class="link-btn-separator">&nbsp;|&nbsp;</span>
      <Button type="text" v-show="isSubtask">add attachment</Button>
      <span class="link-btn-separator" v-show="isSubtask">&nbsp;|&nbsp;</span>
      <Button type="text" @click="showConfirmation">delete card</Button>
    </div>
  </Modal>
</template>

<script>
import store from '../stores';
import { lowerFirstChar, timeFormatter } from '../utils';
import ApiClient from '../helpers/ApiClient';
import CustomDropdown from '@/components/CustomDropdown';
import Comment from '@/components/Comment';

export default {
  name: 'CardModal',
  store,
  components: {
    CustomDropdown,
    Comment
  },
  created () {
    ['Title', 'Detail'].forEach((type) => {
      this[`focus${type}`] = () => this.toggleEdit(type, true);
      this[`blur${type}`] = () => this.toggleEdit(type, false);
    });
  },
  computed: {
    avatar () {
      const { user } = this.$store.state.user;

      return user ? user.avatar : '';
    },
    getCardSuc () {
      return this.$store.state.cardDetail.getCardSuc;
    },
    updateCardSuc () {
      return this.$store.state.card.updateCardSuc;
    },
    updateCommentSuc () {
      return this.$store.state.card.updateCommentSuc;
    },
    repoList () {
      return this.$store.state.repoList.data;
    },
    comments () {
      if (this.card && this.card.comments) {
        return this.card.comments.map((comment) => {
          const user = this.memberList.find(value => value.id === comment.userId);

          return {
            id: comment.id,
            avatar: user.avatar,
            user: user.name,
            time: timeFormatter(comment.time),
            body: comment.body
          };
        });
      }

      console.log('triggeer', this.card);
      return [];
    },
    memberList () {
      const map = this.$store.state.map.map;

      if (!map) {
        return [];
      }
      return this.$store.getters.memberList(map._id);
    },
    card () {
      return this.$store.getters.card(this.$store.state.card.focusId);
    },
    cardTitle: {
      get () {
        return this.title || '<span class="placeholder">Click to add title...</span>';
      },
      set (value) {
        this.title = value;
      }
    },
    cardDetail: {
      get () {
        return this.detail || '<span class="placeholder">Click to add detail...</span>';
      },
      set (value) {
        this.detail = value;
      }
    }
  },
  watch: {
    getCardSuc (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.initialTitle = this.$store.state.cardDetail.data.title;
        this.title = this.initialTitle;
        this.initialDetail = this.$store.state.cardDetail.data.detail;
        this.detail = this.initialDetail;
        this.activeRepo = this.$store.state.cardDetail.data.issue || {};
        this.activeMember = this.$store.state.cardDetail.data.members || [];
      }
    },
    updateCardSuc (newValue, oldValue) {
      if (newValue && !oldValue && this.updateType) {
        const type = this.updateType;
        const _type = type.charAt(0).toLowerCase() + type.slice(1);

        this[`initial${type}`] = this[_type];
        this.updateType = '';
      }
    },
    updateCommentSuc (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.comment = '';
      }
    }
  },
  data () {
    return {
      isFocusTitle: false,
      isFocusDetail: false,
      title: '',
      detail: '',
      comment: '',
      updateType: '',
      isSubtask: false,
      activeRepo: {}, // {owner, repo}
      activeMember: [] // [id]
    };
  },
  methods: {
    checkActiveRepo (data) {
      if (!this.activeRepo) {
        return false;
      }
      const { owner, repo } = this.activeRepo;

      return owner === data.owner.login && repo === data.name;
    },
    checkActiveMember (userId) {
      if (!this.activeMember.length) {
        return false;
      }
      return this.activeMember.indexOf(userId) !== -1;
    },
    changeActiveRepo (e) {
      const owner = e.currentTarget.getAttribute('data_owner');
      const repo = e.currentTarget.getAttribute('data_repo');

      const activeRepo = this.activeRepo;

      // if ('owner' in activeRepo && 'repo' in activeRepo) {
        const oldRepo = `${activeRepo.owner}/${activeRepo.repo}`;
        const newRepo = `${owner}/${repo}`;

        if (oldRepo !== newRepo) {
          // 單選
          this.activeRepo = {
            owner,
            repo
          };

          const mapId = this.$store.state.map.map.id;
          const cardId = this.$store.state.card.focusId;

          ApiClient.POST(`/map/${mapId}/card/${cardId}/issue`, {
            data: {
              owner,
              repo,
              title: this.title,
              body: this.detail,
              id: this.card.id
            }
          }).then((rsponese) => {
            console.log('addIssue successfully', rsponese);
          }, (error) => {
            console.log('addIssue failed', error);
          });
        }
      // }
    },
    changeActiveMember (e) {
      // 複選
      const id = parseInt(e.currentTarget.getAttribute('data_id'), 10);
      const _activeMember = this.activeMember.slice();
      const index = _activeMember.indexOf(id);

      if (index === -1) {
        _activeMember.push(id);
      } else {
        _activeMember.splice(index, 1);
      }
      this.activeMember = _activeMember;

      this.$store.dispatch('updateCard', [{
        id: this.$store.state.card.focusId,
        members: _activeMember
      }]);
    },
    addComment () {
      this.$store.dispatch('addComment', {
        body: this.comment
      });
    },
    toggleEdit (type, status) {
      const _type = lowerFirstChar(type);

      this[`isFocus${type}`] = status;

      if (!status && this[`initial${type}`] !== this[_type]) {
        this.$store.dispatch('updateCard', [{
          id: this.$store.state.card.focusId,
          [_type]: this[_type]
        }]);

        this.updateType = type;
      }
    },
    visiableChange (isOpen) {
      const { dispatch } = this.$store;

      if (isOpen) {
        dispatch('getCard');
      } else {
        dispatch('closeCard');
      }
    },
    showConfirmation () {
      const { dispatch } = this.$store;
      const { type, id } = this.card;
      const childCount = type !== 'subtask' ? this.$store.getters.childCardIds(id).length : 0;
      const title = `<p>Are you sure you want to delete the ${this.title} card?</p>`;
      const warning = `<p>Its <span style="color: red">${childCount} children</span> will also be deleted!</p>`;
      const content = childCount ? title + warning : title;

      this.$Modal.confirm({
        title: 'Confirmation',
        content,
        okText: 'ok',
        cancelText: 'cancel',
        onOk: () => {
          dispatch('deleteCard', id);
          dispatch('closeCard');
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
<style lang="scss" scoped>
.display {
  cursor: pointer;
}

.input {
  width: 100%;
  height: 100%;
  border: 1px dotted #aaa;
}

.card-title {
  width: 100%;
  padding-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid #d1d5da;
  .input,
  .display {
    color: #282828;
    font-weight: bold;
    font-size: 18px;
  }
}

.card-detail {
  padding: 16px 0;
  border-bottom: 1px solid #d1d5da;
  font-size: 14px;
  .box-name {
    margin-bottom: 5px;
    font-weight: bold;
  }
}

.modal-body {
  display: flex;
  flex-wrap: wrap;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 16px;
  height: 400px;
  overflow-y: auto;
  .ivu-btn {
    margin-top: 10px;
    margin-left: auto;
  }
}

.setting {
  display: flex;
  flex-direction: column;
  width: 200px;
  padding-left: 10px;
  border-left: 1px dotted #000;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;
}

.checkbox-container .ivu-icon {
  margin-right: 4px;
}

.checkbox-container .ivu-icon-android-checkbox-outline-blank {
  color: #bbb;
}

.checkbox-container .ivu-icon-android-checkbox {
  color: #66bae1;
}

.checkbox.checked {
  background-color: #66bae1;
  border-color: #66bae1;
}

.ivu-checkbox-group-item {
  width: 100%;
}

.write-comment .comment-input {
  min-height: 100px;
  width: 500px;
}

.comment-btn {
  min-height: 40px;
  margin-left: auto;
  margin-top: 8px;
}
</style>

<style lang="scss">
.placeholder {
  color: #bbb;
}
.comment {
  position: relative;
  margin-top: 16px;
  .member {
    font-weight: bold;
  }
  .avatar {
    display: inline-block;
    width: 25px;
    height: 25px;
    float: left;
  }
  .comment-input,
  .comment-box {
    width: 500px;
    float: right;
  }

  .comment-info {
    position: relative;
    padding-left: 5px;
    line-height: 25px;
    background-color: #f6f8fa;
    border: 1px solid #d1d5da;
    border-bottom: 0;
  }
  .comment-content {
    padding: 5px;
    border: 1px solid #d1d5da;
  }
  .comment-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5da;
    border-bottom: 1px dashed #dfe2e5;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-radius: 3px;
  }
}
</style>
