<template>
  <div id="app">
    <blogUser></blogUser>
    <router-view/>
  </div>
</template>

<script>
import blogUser from '@/components/user'
export default {
  name: 'App',
  data(){
    return {
      username: 'guest'
    }
  },
  components: {blogUser}
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
</style>
