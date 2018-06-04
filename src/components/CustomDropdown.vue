<template>
  <div class="custom-dropdown">
    <Dropdown
      trigger="custom"
      :visible="visible"
      @on-clickoutside="handleClose"
    >
      <span class="dropdown-toggle" @click="handleOpen">
        <span class="title">
          {{ title }}
          <Icon type="gear-a"></Icon>
        </span>
        <slot name="value"></slot>
      </span>
      <DropdownMenu slot="list">
        <slot name="menu"></slot>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
export default {
  name: 'CustomDropdown',
  props: {
    title: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      visible: false
    };
  },
  methods: {
    handleOpen () {
      this.visible = true;
    },
    handleClose () {
      this.visible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .custom-dropdown .ivu-select-dropdown {
    top: 18px !important;
    left: 0 !important;
    min-width: 189px !important;
  }

  .custom-dropdown .ivu-dropdown-item {
    width: 100%;
  }
</style>

<style scoped>
.custom-dropdown {
  position: relative;
  padding-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #bbb;
}

.dropdown-toggle {
  cursor: pointer;
}

.title {
  display: flex;
  align-items: center;
  width: 189px;
  font-size: 14px;
  font-weight: bold;
}

.ivu-icon {
  margin-left: auto;
}
</style>
