<template>
  <div id="app">
    <div class="header">Header</div>
    <router-view/>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'App',
  mounted () {
    this.socketConnect();
  },
  methods: {
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
  padding-left: 8px;
  background-color: #191a1e;
  color: #66bae1;
  font-size: 30px;
  line-height: 60px;
  text-align: left;
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
