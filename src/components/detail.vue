<template>
<div>
  <div id = 'detail'>
      <span>detail</span>
      <div v-if='!err'>
        <div id ="msg" v-for="(key,val) in $store.state.userInfo">{{val}}:{{key}}</div>
        <span id="goOut" v-on:click="goToLogout">logout</span>
      </div>
      <div v-if='err'>
        <div id="msg" v-on:click="goToLogout">Something wrong happened,please relogin</div>
      </div>
  </div>
</div>
</template>

<script>

export default {
  data () {
    return {
      msg: {
        id: '',
        username: '',
        email: '',
        phone: ''
      },
      err: false
    }
  },
  methods: {
    goToLogout: function () {
      this.$http.post('/api/detail/trylogout',{username: this.getCookie('session')})
      .then((res) => {
        //
      }).catch((rej) => {
        //
      })
      this.$emit('changemode', 3)
    }
  },
  mounted: function () {
    if (this.getCookie('session')){
      this.$http.post('/api/detail/getuser', {username: this.getCookie('session')})
      .then((res) => {
        if(res.body === undefined || res.body.length === 0){
          this.err = true
        } else {
          this.err = false
          this.msg = {
            "id": res.body.id,
            "username": res.body.username,
            "email": res.body.email,
            "phone": res.body.phone
          }
          this.$store.commit('updateUserInfo',this.msg)
        }
      }).catch((rej) => {
        this.err = false
        console.log(rej)
      })
    } else {
      this.err = true
      this.msg = {}
    }
  }
}
</script>

<style>
#detail{
  text-align: center;
  position: relative;
  margin: 0 auto;
  top: 100px;
  height: 200px;
  width: 250px;
  background-color: red;
  z-index: 53;
}
#goOut{
  z-index: 53;
  position: absolute;
  left: 160px;
  top: 160px;
}

#msg{
  text-align: left;
  padding-left: 30px;
}
</style>
