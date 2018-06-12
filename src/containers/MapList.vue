<template>
  <div class="board-list">
    <div class="map-container" v-if="mapList.length">
      <div class="header">
        <Icon type="map" size="25"></Icon>
        Your story maps
      </div>
      <div class="map-list">
        <div v-for="map in mapList" class="map" :data-id="map.id" :key="map.id" @click="openMap">
          <h3 class="name">{{ map.name }}</h3>
          <p class="desc">{{ map.desc }}</p>
          <div class="count">
            <span class="release-count">
              <span class="number">{{ map.releases.length }}</span>
              releases
            </span>
            <span class="card-count">
              <span class="number">{{ map.cards.length }}</span>
              cards
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="action-container">
      <div class="header">
        <Icon type="flash" size="25"></Icon>
        Actions
      </div>
      <div class="action-list">
        <div class="action" @click="isOpen = true">
          <Icon type="ios-plus-outline" size="47"></Icon>
          <p>New map</p>
        </div>
      </div>
    </div>

    <Modal
      v-model="isOpen"
      title="Create a new story map"
      cancel-text="Cancel"
      ok-text="Save"
      @on-ok="save"
      @on-visible-change="visiableChange">
      <h3>Name and description</h3>
      <div class="map-name">
        <label>Name</label>
        <input ref="input" class="input" v-model="name" type="text" />
        <p class="error" v-show="error">{{ error }}</p>
      </div>

      <div class="map-desc">
        <label>Description</label>
        <textarea class="input" v-model="desc"></textarea>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  name: 'MapList',
  data () {
    return {
      name: '',
      desc: '',
      error: '',
      isOpen: false
    };
  },
  computed: {
    mapList () {
      return this.$store.state.map.mapList;
    }
  },
  methods: {
    openMap (event) {
      this.$router.push(`/map/${event.currentTarget.dataset.id}`);
    },
    save () {
      if (this.name) {
        this.$store.dispatch('addMap', {name: this.name, desc: this.desc});
        this.isOpen = false;
      } else {
        this.error = 'The name field is required!';
      }
    },
    visiableChange (isOpen) {
      if (isOpen) {
        this.name = '';
        this.desc = '';
        this.error = '';

        setTimeout(() => {
          this.$refs.input.focus();
        }, 0);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .board-list {
    display: flex;
    padding: 20px;
  }

  .map-container {
    margin-right: 60px;
  }

  .header {
    display: flex;
    font-size: 14px;
    align-items: center;
    margin-bottom: 10px;
    .ivu-icon {
      padding-right: 10px;
    }
  }

  .map-list {
    display: flex;
  }

  .map {
    position: relative;
    width: 238px;
    height: 166px;
    padding: 13px;
    margin-right: 10px;
    background-color: #66b9e1;
    color: #fff;
    text-align: left;
    cursor: pointer;
    &:hover {
      background-color: #57afd7;
    }
  }

  .name {
    font-size: 20px;
    font-weight: normal;
  }

  .desc {
    font-size: 11px;
    word-wrap: break-word;
  }

  .count {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 212px;
    justify-content: space-between;
  }

  .number {
    font-size: 22px;
  }

  .action {
    display: flex;
    width: 70px;
    height: 70px;
    justify-content: center;
    flex-direction: column;
    background-color: #2a7ea3;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: #236988;
    }
  }

  .map-name, .map-desc {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .map-name input, .map-desc textarea {
    width: 100%;
  }

  .save-btn, .cancel-btn  {
    color: #fff;
  }

  .save-btn {
    background-color: #66bae1;
    &:hover {
      background-color: #57aed7;
    }
  }

  .cancel-btn {
    background-color: #515151;
    &:hover {
      background-color: #181a1d;
    }
  }

  .error {
    color: red;
  }
</style>
