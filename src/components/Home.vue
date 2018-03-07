<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Vue Doc</h2>
    <ul>
      <li>
        <router-link to="/vuedoc">Vue Doc</router-link>
      </li>
    </ul>
    <h2>Click the button to get Random jokes</h2>
    <button id="btn" class="" v-on:click="getJokes">Get Jokes</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
