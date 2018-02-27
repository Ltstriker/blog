<template>
<div id="user">
  <router-link :to="{ name: 'main', params: {} }" class="main"></router-link>
  <span id = "cancel" v-on:click="userClick"
    v-text="username">
  </span>
</div>
</template>

<script>
import { EventBus } from '../assets/js/event-bus.js';

export default {
  data () {
    return {
      username: ''
    }
  },
  created:function () {
    this.username = this.getCookie('session')===null?'guest':this.getCookie('session');
    EventBus.$on('set', (val)=>{this.username = val});
    EventBus.$on('reset', ()=>{this.username = 'guest'});
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
      }).catch( rej => {
      })
    },
    goToLogin: function () {
      this.$modal.login().then( res => {
      }).catch( rej => {
        if (rej['change']) {
          this.gotoRegister()
        }
      })
    },
    gotoRegister: function () {
      this.$modal.register().then( res => {
      }).catch( rej => {
        if (rej['change']) {
          this.goToLogin()
        }
      })
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
  background: white;
  text-align: right;
  box-shadow: 5px 5px 2.5px #888888,
              16px 16px 16px blue inset,
              -16px -16px 16px blue inset;
}
#cancel{
  z-index: 53;
  margin-right: 10px;
  float: right;
  overflow: visible;
  background-color: inherit;
  border-radius: 5px;
  height: 32px;
  box-shadow: 0px 12px 16px rgba(100,250,255,0.5) inset,
              0px -12px 16px rgba(255, 250, 100,0.5) inset;
}

#cancel:hover {
  cursor: pointer;
}

.main{
  position: absolute;
  left: 10px;
  top: 0px;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  color: white;
  background-image: url('../assets/img/home.jpg');
  background-size: 230%;
  background-position: -10px -22px;
  text-decoration: none;
}
</style>
