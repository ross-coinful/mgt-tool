<template>
  <div class="release-title">
    <input v-if="isEdit" type="text" v-model="title" v-focus="true" @blur="blurTitle">
    <span v-else>
      <span v-if="isShrink" @click="expandRelease">
        <Icon type="plus"></Icon>
      </span>
      <span v-else @click="shrinkRelease">
        <Icon type="minus"></Icon>
      </span>

      {{ title }}
      <Dropdown trigger="click" placement="bottom-start">
        <span>
          <Icon type="chevron-down"></Icon>
        </span>
        <DropdownMenu slot="list">
          <DropdownItem>
            <span @click="shrinkOtherReleases">Show releated cards</span>
          </DropdownItem>
          <DropdownItem v-if="releaseId !== 0">
            <span @click="isEdit = true">Edit name</span>
          </DropdownItem>

          <DropdownItem v-if="releaseId === 0">
            <span @click="createReleaseAbove">Add new release above</span>
          </DropdownItem>
          <DropdownItem v-else>
            <span @click="createReleaseBelow">Add new release below</span>
          </DropdownItem>

          <DropdownItem
            v-if="releaseIndex !== (releaseList.length - 1)"
          >
            <span @click="moveReleaseDown">Move down</span>
          </DropdownItem>
          <DropdownItem
            v-if="releaseIndex !== 0 && releaseId !== 0"
            @click="moveReleaseUp"
          >
            <span @click="moveReleaseUp">Move up</span>
          </DropdownItem>
          <DropdownItem v-if="releaseId !== 0">
            <span @click="deleteRelease">Delete release</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </span>
  </div>
</template>

<script>
import { lowerFirstChar } from '../utils';

export default {
  name: 'Release',
  props: {
    releaseId: {
      type: Number,
      required: true
    },
    releaseTitle: {
      type: String,
      required: true
    },
    releaseIndex: {
      type: Number,
      required: true
    },
    setCreateReleasePos: {
      type: Function,
      required: true
    },
    isShrink: {
      type: Boolean,
      required: true
    }
  },
  created () {
    ['Up', 'Down'].forEach((way) => {
      const _way = lowerFirstChar(way);
      this[`moveRelease${way}`] = () => this.moveRelease(_way);
    });

    ['Above', 'Below'].forEach((pos) => {
      const _pos = lowerFirstChar(pos);
      this[`createRelease${pos}`] = () => this.createRelease(_pos);
    });
  },
  data () {
    return {
      isEdit: false,
      title: this.releaseTitle
    };
  },
  computed: {
    releaseList () {
      return this.$store.getters.releaseList;
    }
  },
  methods: {
    blurTitle () {
      if (this.title !== this.releaseTitle) {
        this.$store.dispatch('updateRelease', [{
          id: this.releaseId,
          title: this.title
        }]);
      }

      this.isEdit = false;
    },
    expandRelease () {
      this.$store.dispatch('expandRelease', this.releaseId);
    },
    shrinkRelease () {
      this.$store.dispatch('shrinkRelease', this.releaseId);
    },
    shrinkOtherReleases () {
      this.$store.dispatch('shrinkOtherReleases', this.releaseId);
    },
    moveRelease (way) {
      const release = this.$store.state.release.releaseList.find(value => value.id === this.releaseId);

      const releatedIndex = way === 'up' ? this.releaseIndex - 1 : this.releaseIndex + 1;
      const releatedRelease = this.$store.state.release.releaseList[releatedIndex];

      this.$store.dispatch('updateRelease', [{
        id: release.id, order: releatedRelease.order
      }, {
        id: releatedRelease.id, order: release.order
      }]);
    },
    createRelease (pos) {
      this.setCreateReleasePos(this.releaseIndex, pos);
    },
    deleteRelease () {
      const subtasks = this.$store.state.card.cardList.filter(value => value.releaseId === this.releaseId);
      const options = subtasks.length ? this.$store.state.release.releaseList
        .filter(value => value.id !== this.releaseId && value.id !== 0)
        .reduce((acc, cur) => { return acc + `<option value='${cur.id}'>${cur.title}</option>`; }, '') : '';

      const content = subtasks.length ? `
        <div>
          <p>There are subtasks associated with this release.<br />Do you want to</p>
          <div>
            <label><input type="radio" name="opt" value="unsceduled" checked/>leave them unsceduled, or</label>
          </div>
          <div>
            <label><input type="radio" name="opt" value="others" />move them to</label>
            <select id="select">
              ${options}
            </select>
          </div>
        </div>` : 'Are you sure you want to delete this release?';

      this.$Modal.confirm({
        title: 'Confirmation',
        content: content,
        onOk: () => {

          if (subtasks.length) {
            const checkValue = document.querySelector('input[name="opt"]:checked').value;
            const newReleaseId = checkValue === 'unsceduled' ? 0 : parseInt(document.getElementById('select').value, 10) || 0;

            const parentIds = [];
            const updateDatas = subtasks.map(value => {

              if (parentIds.indexOf(value.parentId) === -1) {
                parentIds.push(value.parentId);
              }

              return {
                id: value.id,
                releaseId: newReleaseId
              };
            });

            parentIds.forEach(parentId => {
              const newList = this.$store.getters.subtaskCardIds(parentId, newReleaseId);

              if (newList.length > 0) {
                const firstId = subtasks.find(value => value.parentId === parentId && !('prevId' in value)).id;
                updateDatas.find(value => value.id === firstId).prevId = newList[newList.length - 1];
              }
            });

            this.$store.dispatch('updateCard', updateDatas);
          }
          this.$store.dispatch('deleteRelease', this.releaseId);
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
.release-title {
  height: 21px;
  padding-left: 8px;
  border-right: 1px dotted #bbb;
  border-bottom: 1px dotted #bbb;
  background-color: #efefef;
  color: #66b9e1;
  font-size: 14px;
}

.ivu-dropdown-item {
  padding: 0;
}

.ivu-dropdown-item span {
  display: inline-block;
  width: 100%;
  padding: 7px 16px;
}
</style>
