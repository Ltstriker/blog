<template>
<div>
  <div id = 'register'>
    <span class="signInReg">register</span>
    <input class="form-control" id="id" placeholder="id" v-model="id">
    <input class="form-control" id="username" placeholder="username" v-model="username">
    <input type="password" class="form-control" id="password" placeholder="password" v-model="password">
    <input type="password" class="form-control" id="passwordrepeat" placeholder="password-repeat" v-model="passwordrepeat">
    <input class="form-control" id="email" placeholder="eamil" v-model="email">
    <input class="form-control" id="phone" placeholder="phone" v-model="phone">
    <button type="submit" id='btnInReg' @click="register">register</button>
    <span id="goIn" v-on:click="goToLogin">login</span>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      username: '',
      password: '',
      passwordrepeat: '',
      email: '',
      phone: ''
    }
  },
  methods: {
    register: function () {
      let params = {
        id: this.id,
        username: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone
      }
      this.$http.post('/api/register/tryregister', params)
      .then((res) => {
        if(res.body == "succeed") {
          let expireDays = 1000 * 60 * 60 * 24 * 15;
          this.setCookie('session',this.username, expireDays);
          this.$emit('changemode', 0)
        }
      }).catch((rej) => {
        console.log('reject to register');
      })
    },
    goToLogin: function () {
      this.$emit('changemode', 1)
    }
  }
}
</script>

<style>
#register{
  z-index: 53;
  position: relative;
  margin: 0 auto;
  top: 100px;
  height: 415px;
  width: 250px;
  background-color: red;
}

#id{
  top: 50px;
}

#username{
  top: 100px;
}

#password{
  top: 150px;
}

#passwordrepeat{
  top: 200px;
}

#email{
  top: 250px;
}

#phone{
  top: 300px;
}

.signInReg{
  position: absolute;
  left: 75px;
  font-size: 21pt;
  font-weight: bold;
}
#btnInReg{
  position: absolute;
  top: 345px;
  left: 70px;
  height: 30px;
  font-size: 18pt;
}
#goIn{
  z-index:53;
  position: absolute;
  left: 180px;
  top: 380px;
}

#goIn{
  cursor: pointer;
}
</style>
