<template>
  <Modal
    v-model="$store.state.card.isOpen"
    title="Card"
    width="700"
    ok-text="add comment"
    @on-visible-change="visiableChange">
    <div class="modal-body">
      <div class="content">
        <div class="card-title">
          <p class="display" v-if="!isFocusTitle" @click="focusTitle">{{ cardTitle }}</p>
          <input class="input" v-else v-model="title" type="text" @blur="blurTitle" v-focus="isFocusTitle" />
        </div>

        <div class="detail">
          <p class="display" v-if="!isFocusDetail" @click="focusDetail">{{ cardDetail }}</p>
          <textarea class="input" v-else v-model="detail" @blur="blurDetail" v-focus="isFocusDetail"></textarea>
        </div>
      </div>
      <div class="setting">
        <div>
          <label class="title">Add issue to</label>
          <div class="checkbox-group">
            <div
              v-for="repo in repoList"
              :key="repo.id"
              :data_owner="repo.owner.login"
              :data_repo="repo.name"
              class="checkbox-container"
              @click="checkChange"
            >
              <Icon
                v-if="checkActiveRepo(repo)"
                type="android-checkbox"
                size="15"
              ></Icon>
              <Icon v-else type="android-checkbox-outline-blank" size="15"></Icon>
              {{ repo.full_name }}
            </div>
          </div>
        </div>
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
import { lowerFirstChar } from '../utils';
import ApiClient from '../helpers/ApiClient';

export default {
  name: 'CardModal',
  store,
  computed: {
    getCardDetailSuc () {
      return this.$store.state.cardDetail.getCardDetailSuc;
    },
    updateCardSuc () {
      return this.$store.state.card.updateCardSuc;
    },
    repoList () {
      return this.$store.state.repoList.data;
    },
    card () {
      return this.$store.getters.card(this.$store.state.card.focusId);
    },
    cardTitle: {
      get () {
        return this.title || 'Click to add title.';
      },
      set (value) {
        this.title = value;
      }
    },
    cardDetail: {
      get () {
        return this.detail || 'Click to add detail.';
      },
      set (value) {
        this.detail = value;
      }
    }
  },
  watch: {
    getCardDetailSuc (newValue, oldValue) {

      if (newValue && !oldValue) {
        this.initialTitle = this.$store.state.cardDetail.data.title;
        this.title = this.initialTitle;
        this.initialDetail = this.$store.state.cardDetail.data.detail;
        this.detail = this.initialDetail;
        this.checkValue = this.$store.state.cardDetail.data.issue;
      }
    },
    updateCardSuc (newValue, oldValue) {

      if (newValue && !oldValue && this.updateType) {
        const type = this.updateType;
        const _type = type.charAt(0).toLowerCase() + type.slice(1);
        console.log('reset');
        this[`initial${type}`] = this[_type];
        this.updateType = '';
      }
    }
  },
  data () {
    return {
      isFocusTitle: false,
      isFocusDetail: false,
      title: '',
      detail: '',
      updateType: '',
      isSubtask: false,
      checkValue: null
    };
  },
  created () {
    ['Title', 'Detail'].forEach((type) => {
      this[`focus${type}`] = () => this.toggleEdit(type, true);
      this[`blur${type}`] = () => this.toggleEdit(type, false);
    });
  },
  methods: {
    checkActiveRepo (data) {
      if (!this.checkValue) {
        return false;
      }
      const { owner, repo } = this.checkValue;

      return owner === data.owner.login && repo === data.name;
    },
    checkChange (e) {
      const owner = e.currentTarget.getAttribute('data_owner');
      const repo = e.currentTarget.getAttribute('data_repo');

      // 單選
      this.checkValue = {
        owner,
        repo
      };

      ApiClient.POST('/issue', {
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
      // 複選
      // const _checkValue = this.checkValue.slice();
      // const index = _checkValue.indexOf(value);

      // if (index === -1) {
      //   _checkValue.push(value);
      // } else {
      //   _checkValue.splice(index, 1);
      // }
      // this.checkValue = _checkValue;
    },
    toggleEdit (type, status) {
      const _type = lowerFirstChar(type);

      this[`isFocus${type}`] = status;

      if (!status && this[`initial${type}`] !== this[_type]) {
        this.$store.dispatch('updateCard', {
          id: this.$store.state.card.focusId,
          [_type]: this[_type]
        });

        this.updateType = type;
      }
    },
    visiableChange (isOpen) {
      const { dispatch, state } = this.$store;

      if (isOpen) {
        dispatch('getCardDetail', state.card.focusId);
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
<style scoped>
.display {
  cursor: pointer;
}

.input {
  width: 100%;
  height: 100%;
  border: 1px dotted #aaa;
  outline: 0;
}

.card-title {
  margin-bottom: 20px;
}

.card-title .display {
  color: #282828;
  font-weight: bold;
  font-size: 16px;
}

.detail,
.detail .input {
  min-height: 160px;
}

.detail .display {
  color: #282828;
  font-size: 14px;
}

.modal-body {
  display: flex;
}

.content {
  width: 400px;
}

.setting {
  padding-left: 10px;
  flex: 1;
  border-left: 1px dotted #000;
}

.setting .title {
  font-size: 14px;
  font-weight: bold;
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
</style>
