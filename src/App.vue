<template>
  <div id="app">
    <div id = 'background' v-show="lock" v-on:click="changelock" ></div>
    <blogUser :givelockmsg='lock' v-on:lockmsg='changelock'></blogUser>
    <router-view/>
  </div>
</template>

<script>
import blogUser from '@/components/user'
export default {
  name: 'App',
  data(){
    return {
      lock: false,
      username: 'guest'
    }
  },
  components: {blogUser},
  methods: {
    changelock: function () {
      this.lock = !this.lock
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#background{
  background-color: gray;
  opacity: 0.5;
  position: absolute;
  width: 100%;
  bottom: 0px;
  top: 0px;
  z-index: 50;
  background-size: cover;
}
</style>
