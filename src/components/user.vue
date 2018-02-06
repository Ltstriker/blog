<template>
<div id="user">
  <router-link :to="{ name: 'main', params: {} }" class="main">Main</router-link>
  <span id = "cancel" v-on:click="userClick" v-text="this.getCookie('session')===null?'guest':this.getCookie('session')"></span>
  <span v-if='givelockmsg && mode == 0'>
    <detail v-on:changemode= "changemodeto"></detail>
  </span>
  <span v-if='givelockmsg && mode ==1'>
    <login v-on:changemode= "changemodeto"></login>
  </span>
  <span v-if='givelockmsg && mode ==2'>
    <register v-on:changemode= "changemodeto"></register>
  </span>
</div>
</template>

<script>
import detail from '@/components/detail'
import login from '@/components/login'
import register from '@/components/register'

export default {
  data () {
    return {
      mode: 1
    }
  },
  props: ['givelockmsg'],
  components: {detail, login, register},
  created: function () {
    if (this.getCookie('session')===null) {
      this.mode = 1
    } else {
      this.mode = 0
    }
  },
  methods: {
    userClick: function () {
      this.$emit('lockmsg')
    },
    changemodeto: function (modecode) {
      this.mode = modecode
      if (this.mode == 0) {
        this.mode = 0
        this.$emit('usermsg', this.getCookie('session')===null?'guest':this.getCookie('session'))
        this.userClick()
      }
      else if (this.mode == 3) {
        this.delCookie('session')
        this.$emit('usermsg',this.getCookie('session')===null?'guest':this.getCookie('session'))
        this.mode = 1
      }
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
