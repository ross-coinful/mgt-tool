<template>
  <div id="app">
    <div v-if="$route.path !== '/login'" class="header">
      <Icon type="ios-arrow-left" size="30"></Icon>
      <h2 class="header-text">Header</h2>
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
    <router-view/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import store from './stores';
import { mapActions } from 'vuex';

export default {
  name: 'App',
  store,
  created () {
    if (localStorage.getItem('token')) {
      this.$store.dispatch('getUser');
    }
  },
  mounted () {
    // this.socketConnect();
  },
  computed: {
    username () {
      const { user } = this.$store.state.auth;

      return user ? user.name : 'Account';
    },
    isLogout () {
      return this.$store.state.auth.logoutSuc;
    }
  },
  watch: {
    isLogout (newValue, oldValue) {

      if (newValue && !oldValue) {
        this.$router.push('/login');
      }
    }
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
    }
  }
};
</script>

<style scoped>
.header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  padding-left: 10px;
  background-color: #191a1e;
  color: #66bae1;
  line-height: 60px;
  text-align: left;
}

.header .header-text {
  display: inline-block;
  margin-left: 10px;
  font-size: 30px;
  font-weight: normal;
}

.account-container {
  float: right;
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
  margin-top: 60px;
}
</style>
