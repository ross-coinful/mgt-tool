<template>
  <div class="home">
    <h1>Sign in</h1>

    <form>
    <!--
      <label>Username or email address</label>
      <input type="text" name="username" v-model="username" />
      <label>Password</label>
      <input type="text" name="password" v-model="password" />
      <Button type="success" long :loading="loading" :disabled="disabled" @click="login">Sign in</Button>
    -->
      <Button type="success" long :loading="loading" @click="login">Sign in with Github</Button>
    </form>
  </div>
</template>

<script>
import store from '../stores';
import { clientId, state } from '../../data';

export default {
  name: 'Login',
  store,
  data () {
    return {
      loading: false,
      username: '',
      password: ''
    };
  },
  computed: {
    disabled () {
      return this.username === '' || this.password === '';
    },
    getTokenSuc () {
      return this.$store.state.auth.getTokenSuc;
    }
  },
  watch: {
    getTokenSuc (newValue, oldValue) {

      if (newValue && !oldValue) {
        this.$router.push('/');
        this.$store.dispatch('getUser');
      }
    }
  },
  methods: {
    login () {
      this.loading = true;

      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user&state=${state}`;
      // this.$store.dispatch('checkAuth');

      console.log('login');
    }
  },
  created () {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      window.history.pushState({ code }, null, '/#/');

      console.log('state', window.history.state.code);

      this.$store.dispatch('getToken', code);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
  width:  340px;
  margin: 20px auto;
  padding: 20px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #d8dee2;
  border-radius: 3px;
}

label, input {
  display: inline-block;
  width:  100%;
}

label {
  text-align: left;
}

input {
  min-height: 34px;
  padding: 6px;
  margin-top: 5px;
  margin-bottom: 20px;
  border: 1px solid #d8dee2;
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(27,31,35,0.075);
}

.ivu-btn-success {
  height: 35px;
  border-color: #d8dee2;
}
</style>
