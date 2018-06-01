<template>
  <div id="app">
    <div v-if="$route.path !== '/login'" class="header">
      <span v-if="$route.path !== '/'" class="btn back-page" @click="backPrevPage">
        <Icon type="ios-arrow-left" size="30"></Icon>
      </span>
      <h2 class="header-text">{{ headerName }}</h2>

      <div v-if="$route.path !== '/'" class="tool-bar">
        <span class="zoom">
          <span class="btn" @click="zoomOut">
            <Icon type="ios-minus-outline" size="30"></Icon>
          </span>

          <span class="line">
            <span
              class="zoomer"
              :style="zoomerStyle"
              @mousedown="zoomStart"
              @mouseup="zoomEnd"
            >
            </span>
          </span>

          <span class="btn" @click="zoomIn">
            <Icon type="ios-plus-outline" size="30"></Icon>
          </span>
        </span>

        <span class="btn circle-border" data_type="filter-search" @click="openToolPanel">
          <Icon type="funnel" size="15"></Icon>
        </span>

        <span class="btn circle-border" data_type="add-member" @click="openToolPanel">
          <Icon type="person-add" size="15"></Icon>
        </span>
      </div>

      <Dropdown class="account-container">
        <span class="account">
          <Icon type="android-person" size="20"></Icon>
          <span class="account-name">{{ username }}</span>
          <Icon type="arrow-down-b" size="20"></Icon>
        </span>
        <DropdownMenu slot="list">
          <span @click="logout">
            <DropdownItem>Logout</DropdownItem>
          </span>
        </DropdownMenu>
      </Dropdown>
    </div>

    <div class="tool-panel" :style="widthStyle">
      <span class="btn circle-border" @click="closeToolPanel">
        <Icon type="chevron-right" size="15"></Icon>
      </span>
      <div v-if="activePanel === 'filter-search'" class="tool-box">
        <h3 class="title">Search & filter</h3>
        <input type="text" />
      </div>
      <div v-else class="tool-box">
        <h3 class="title">Add member</h3>
        <div v-for="user in userList" :key="user.id" class="user">
          <span v-if="user.maps.indexOf(mapId) === -1" class="add-btn" :data_id="user.id" @click="addMember">
            <Icon type="ios-plus-outline" size="15"></Icon>
          </span>
          <span v-else class="add-btn" :data_id="user.id" @click="removeMember">
            <Icon type="ios-minus-outline" size="15"></Icon>
          </span>
          <img class="photo" :src="user.avatar" />
          <span class="name">{{ user.name }}</span>
        </div>
      </div>
    </div>

    <router-view :style="zoomStyle"/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import store from './stores';
import { mapActions } from 'vuex';
import { lowerFirstChar } from './utils';
import ApiClient from './helpers/ApiClient';

export default {
  name: 'App',
  store,
  created () {

    if (localStorage.getItem('isLogin')) {
      this.getInitialData();
    }

    ['In', 'Out'].forEach((type) => {
      this[`zoom${type}`] = () => this.zoom(type, true);
    });
  },
  computed: {
    username () {
      const { user } = this.$store.state.user;

      return user ? user.name : '';
    },
    headerName () {
      const { map } = this.$store.state.map;

      return map && this.$route.path !== '/' ? map.name : '';
    },
    mapId () {
      const { map } = this.$store.state.map;

      return map ? map._id : null;
    },
    userList () {
      return this.$store.getters.userList;
    },
    isLogin () {
      return this.$store.state.auth.loginSuc;
    },
    isLogout () {
      return this.$store.state.auth.logoutSuc;
    },
    zoomStyle () {

      if ((this.$route.path).indexOf('map') === -1) {
        return '';
      }
      const style = `zoom: ${this.zoomLevel * 100}%;`;

      if (this.activePanel !== '') {
        return `${style} width: calc(100% - ${400 / this.zoomLevel}px)`;
      }
      return style;
    },
    zoomerStyle () {
      return `left: ${this.zoomerPos + (this.zoomLevel - 1) * 100}px`;
    },
    widthStyle () {
      return this.activePanel !== '' ? 'width: 400px' : 'width: 0px';
    }
  },
  watch: {
    isLogout (newValue, oldValue) {

      if (newValue && !oldValue) {
        this.$router.push('/login');
      }
    },
    isLogin (newValue, oldValue) {

      if (newValue && !oldValue) {
        this.$router.push('/');
        this.getInitialData();
      }
    },
    $route (to, from) {
        this.activePanel = '';
    }
  },
  data () {
    return {
      zoomLevel: 1,
      zoomerPos: 49,
      activePanel: ''
    };
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    socketConnect () {
      this.socket = io.connect('ws://localhost:8010');

      this.socket.on('test', (obj) => {
        console.log('socketConnect', obj);
      });
    },
    getInitialData () {
      this.$store.dispatch('getUser');
      this.$store.dispatch('getMapList');
      this.$store.dispatch('getRepoList');
      this.$store.dispatch('getUserList');
    },
    backPrevPage () {
      this.$router.go(-1);
    },
    zoom (type) { // range: -5 ~ 5
      const _type = lowerFirstChar(type);

      if (_type === 'in' && this.zoomLevel < 1.5) {
        this.zoomLevel += 0.1;
      } else if (_type === 'out' && this.zoomLevel > 0.6) {
        this.zoomLevel -= 0.1;
      }
      return false;
    },
    zoomStart (event) {
      event.stopPropagation();
      event.preventDefault();

      this.startX = event.screenX;
      window.addEventListener('mousemove', this.zoomMove);
      window.addEventListener('mouseup', this.zoomEnd);
    },
    zoomMove (event) {
      this.movementX = event.screenX - this.startX;

      if (this.movementX / 10 > 1 && this.zoomLevel < 1.5) {
        this.zoomLevel += 0.1;
        this.startX += 10;
      } else if (this.movementX / 10 < -1 && this.zoomLevel > 0.6) {
        this.zoomLevel -= 0.1;
        this.startX -= 10;
      }
    },
    zoomEnd () {
      window.removeEventListener('mousemove', this.zoomMove);
      window.removeEventListener('mouseup', this.zoomEnd);
    },
    openToolPanel (e) {
      this.activePanel = e.currentTarget.getAttribute('data_type');
    },
    closeToolPanel () {
      this.activePanel = '';
    },
    addMember (e) {
      const data = {
        mapId: this.mapId,
        userId: e.currentTarget.getAttribute('data_id')
      };

      ApiClient.PATCH('/user/map', {
        data
      }).then((rsponese) => {
        this.$store.dispatch('getUserList');
      }, (error) => {
        console.log('addMember failed', error);
      });
    },
    removeMember (e) {
      const data = {
        mapId: this.mapId,
        userId: e.currentTarget.getAttribute('data_id')
      };

      ApiClient.DELETE('/user/map', {
        data
      }).then((rsponese) => {
        this.$store.dispatch('getUserList');
      }, (error) => {
        console.log('removeMember failed', error);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 10px;
  background-color: #191a1e;
  color: #fff;
  line-height: 60px;
  text-align: left;
}

.header-text {
  display: inline-block;
  margin-left: 10px;
  margin-right: auto;
  color: #66bae1;
  font-size: 30px;
  font-weight: normal;
}

.btn,
.zoom,
.tool-bar {
  display: flex;
  align-items: center;
}

.btn,
.account {
  &:hover {
    color: #66bae1;
    cursor: pointer;
  }
}

.btn {
  margin-right: 15px;
}

.back-page {
  margin-right: 5px;
}

.zoom {
  margin-right: 30px !important;
  .btn {
    margin: 0;
  }
}

.line {
  position: relative;
  width: 100px;
  height: 4px;
  margin: 0 10px;
  background-color: #fff;
  .zoomer {
    position: absolute;
    top: -8px;
    width: 4px;
    height: 20px;
    background-color: #fff;
    &:hover {
      cursor: pointer;
      background-color: #66bae1;
    }
  }
}

.circle-border {
  width: 25px;
  height: 25px;
  border: 1.3px solid #fff;
  border-radius: 50%;
  text-align: center;
  justify-content: center;
  &:hover {
    border-color: #66bae1;
  }
}

.ivu-icon-person-add {
  position: relative;
  top: -1px;
}

.account-container {
  margin-right: 30px;
  cursor: pointer;
}

.account {
  display: flex;
  align-items: center;
}

.account-name {
  margin: 0 5px;
}

.tool-panel {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 400px;
  height: calc(100vh - 60px);
  background-color: #fff;
  border-left: 1px dotted #bbb;
  color: #000;
  transition: width .8s;
  .circle-border {
    position: absolute;
    top: 18px;
    left: 20px;
    width: 30px;
    height: 30px;
    color: #efefef;
    border-color: #efefef;
    &:hover {
      color: #66bae1;
      border-color: #66bae1;
    }
  }
}

.tool-box {
  padding: 10px 20px;
  text-align: left;
  .title {
    padding-left: 38px;
    font-size: 30px;
    font-weight: normal;
    color: #66bae1;
  }
}

.user {
  display: flex;
  align-items: center;
  height: 30px;
  margin-top: 10px;
  .add-btn {
    margin-right: 8px;
    color: #bbb;
    &:hover {
      color: #66bae1;
      cursor: pointer;
    }
  }
  .photo {
    display: inline-block;
    width: 30px;
    height: 30px;
  }
  .name {
    margin-left: 8px;
    font-size: 16px;
    line-height: 30px;
  }
}
</style>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.card-title {
  word-break: break-all;
}
</style>
