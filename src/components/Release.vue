<template>
  <div class="release-title">
    <span v-if="isShrink" @click="expandRelease">
      <Icon type="plus"></Icon>
    </span>
    <span v-else @click="shrinkRelease">
      <Icon type="minus"></Icon>
    </span>
    {{ releaseTitle }}

    <Dropdown trigger="click" placement="bottom-start">
      <span>
        <Icon type="chevron-down"></Icon>
      </span>
      <DropdownMenu slot="list">
        <DropdownItem>
          <span>Show releated cards</span>
        </DropdownItem>
        <DropdownItem>
          <span>Edit name</span>
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
          v-if="releaseIndex !== 0"
          @click="moveReleaseUp"
        >
          <span @click="moveReleaseUp">Move up</span>
        </DropdownItem>
        <DropdownItem>
          <span>Delete release</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

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
  computed: {
    releaseList () {
      return this.$store.getters.releaseList;
    }
  },
  methods: {
    expandRelease () {
      this.$store.dispatch('expandRelease', this.releaseId);
    },
    shrinkRelease () {
      this.$store.dispatch('shrinkRelease', this.releaseId);
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
