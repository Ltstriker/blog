<template>
<div>
  <div id = 'login'>
    <span class='sign'>login</span>
    <input class="form-control" id="usernameInlogin" placeholder="username" v-model="username">
    <input type="password" class="form-control" id="passwordInLogin" placeholder="password" v-model="password">
    <button type="submit" id='btnInLgin' @click="login">login</button>
    <span id = 'goReg' v-on:click="goToRegister">register</span>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      let params = {
        username: this.username,
        password: this.password
      }
      this.$http.post('/api/login/trylogin',params)
      .then((res) => {
        if(res.body=="succeed") {
          let expireDays = 1000 * 60 * 60 * 24 * 15;
          this.setCookie('session',this.username, expireDays);
          this.$emit('changemode', 0)
        }
      })
      .catch((reject) => {
        console.log('r');
        console.log(reject);
      })

    },
    goToRegister: function () {
      this.$emit('changemode', 2)
    }
  }
}
</script>

<style>
#login{
  z-index: 53;
  position: relative;
  margin: 0 auto;
  top: 100px;
  height: 200px;
  width: 250px;
  background-color: red;
}

.form-control{
  position: absolute;
  padding: 10px;
  height: 8px;
  left: 30px;
}

#usernameInlogin{
  top: 50px;
}

#passwordInLogin{
  top: 100px;
}

.sign{
  position: absolute;
  left: 95px;
  font-size: 21pt;
  font-weight: bold;
}

#btnInLgin{
  position: absolute;
  top: 141px;
  left: 100px;
  height: 30px;
  font-size: 18pt;
}

#goReg{
  z-index: 99;
  position: absolute;
  left: 160px;
  top: 170px;
}

#goReg:hover{
  cursor: pointer;
}
</style>
