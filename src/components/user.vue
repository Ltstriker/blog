<template>
<div id="user">
  <router-link :to="{ name: 'main', params: {} }" class="main">Main</router-link>
  <span id = "cancel" v-on:click="userClick"
    v-text="username">
  </span>
</div>
</template>

<script>

export default {
  data () {
    return {
      username: 'guest'
    }
  },
  methods: {
    userClick: function () {
      if (this.getCookie('session')===null) {
        this.goToLogin();
      } else {
        this.goToDetail();
      }
    },
    goToDetail: function () {
      this.$modal.detail().then( res => {
        this.getUsername();
      }).catch( rej => {
        this.getUsername();
      })
    },
    goToLogin: function () {
      this.$modal.login().then( res => {
        this.getUsername();
      }).catch( rej => {
        if (rej['change']) {
          this.gotoRegister()
        }
        this.getUsername();
      })
    },
    gotoRegister: function () {
      this.$modal.register().then( res => {
        //console.log(res)
        this.getUsername();
      }).catch( rej => {
        //console.log(rej)
        if (rej['change']) {
          this.goToLogin()
        }
        this.getUsername();
      })
    },
    getUsername: function () {
      this.username = this.getCookie('session')===null?'guest':this.getCookie('session')
    }
  }
}
</script>

<style>
#user
{
  position: absolute;
  top: 0;
  right: 0;
  height: 32px;
  font-size: 18pt;
  width: 100%;
  background: blue;
  text-align: right;
}
#cancel{
  z-index: 53;
  overflow: visible;
  height: 50px;
  width: 100px;
  background-color: yellow;
}
.main{
  position: absolute;
  left: 0px;
  color: white;
  padding: 5px;
  text-decoration: none;
}
</style>
