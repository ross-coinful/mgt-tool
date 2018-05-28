<template>
  <div id="app">
    <div v-if="$route.path !== '/login'" class="header">
      <span v-if="$route.path !== '/'" class="btn back-page" @click="backPrevPage">
        <Icon type="ios-arrow-left" size="30"></Icon>
      </span>
      <h2 class="header-text">Header</h2>

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

        <span class="btn circle-border" @click="backPrevPage">
          <Icon type="funnel" size="15"></Icon>
        </span>

        <span class="btn circle-border" @click="backPrevPage">
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
    <router-view :style="zoomStyle"/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import store from './stores';
import { mapActions } from 'vuex';
import { lowerFirstChar } from './utils';

export default {
  name: 'App',
  store,
  created () {
    if (localStorage.getItem('token')) {
      this.$store.dispatch('getUser');
    }

    ['In', 'Out'].forEach((type) => {
      this[`zoom${type}`] = () => this.zoom(type, true);
    });
  },
  computed: {
    username () {
      const { user } = this.$store.state.auth;

      return user ? user.name : 'Account';
    },
    isLogout () {
      return this.$store.state.auth.logoutSuc;
    },
    zoomStyle () {
      return (this.$route.path).indexOf('map') !== -1 ? `zoom: ${this.zoomLevel * 100}%` : '';
    },
    zoomerStyle () {
      return `left: ${this.zoomerPos + (this.zoomLevel - 1) * 100}px`;
    }
  },
  watch: {
    isLogout (newValue, oldValue) {

      if (newValue && !oldValue) {
        this.$router.push('/login');
      }
    }
  },
  data () {
    return {
      zoomLevel: 1,
      zoomerPos: 49
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
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  // position: absolute;
  // top: 0;
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
