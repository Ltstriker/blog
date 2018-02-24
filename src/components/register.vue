<template>
  <div>
    <div class="register-main">
      <div class="register-title">
        <h1 class="register-text">register</h1>
        <i class="register-cancel" @click="cancelFn">x</i>
      </div>
      <div class="register-form">
        <input class="form-control" id="id" placeholder="id" v-model="msg.id">
        <div class="id-err msg-err" v-if='paramsErr.id!==""'>{{paramsErr.id}}</div>
        <input class="form-control" id="username" placeholder="username" v-model="msg.username">
        <div class="username-err msg-err" v-if='paramsErr.username!==""'>{{paramsErr.username}}</div>
        <input type="password" class="form-control" id="password" placeholder="password" v-model="msg.password">
        <div class="password-err msg-err" v-if='paramsErr.password!==""'>{{paramsErr.password}}</div>
        <input type="password" class="form-control" id="passwordrepeat" placeholder="password-repeat" v-model="msg.passwordrepeat">
        <div class="passwordR-err msg-err" v-if='msg.password!==msg.passwordrepeat'>Two inputted password inconsistencies</div>
        <input class="form-control" id="email" placeholder="eamil" v-model="msg.email">
        <div class="email-err msg-err" v-if='paramsErr.email!==""'>{{paramsErr.email}}</div>
        <input class="form-control" id="phone" placeholder="phone" v-model="msg.phone">
        <div class="phone-err msg-err" v-if='paramsErr.phone!==""'>{{paramsErr.phone}}</div>
      </div>
      <div class="register-footer">
        <button class="register-btn" @click="register">register</button>
        <div class="change">
          have got an account?hit
          <span class='link' @click="gotoRegister">here</span>
          to login
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import validator from '@/assets/js/validator.js'

export default {
  data () {
    return {
      paramsErr: {
        id: '',
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      msg: {
        id: '',
        username: '',
        password: '',
        passwordrepeat: '',
        email: '',
        phone: ''
      }
    }
  },
  methods: {
    register: function () {
      let params = {
        id: this.msg.id,
        username: this.msg.username,
        password: this.msg.password,
        email: this.msg.email,
        phone: this.msg.phone
      }
      this.$http.post('/api/register/tryregister', params)
      .then((res) => {
        this.paramsErr = res.body.msg;
        if(res.body.sign) {
          let expireDays = 1000 * 60 * 60 * 24 * 15;
          this.setCookie('session',this.msg.username, expireDays);
          this.$emit('$ok', this.$el,{err: null, change: false})
        }
      }).catch((rej) => {
        console.log('reject to register');
        this.$emit('$ok', this.$el,{err: 'err', change: false})
      })
    },
    cancelFn: function () {
      this.$emit('$cancel', this.$el, {err: 'cancel', change: false})
    },
    gotoRegister: function () {
      this.$emit('$cancel', this.$el, {err: 'change', change: true})
    }
  },
  watch: {
    'msg.id': function (val) {
      this.paramsErr.id = validator.checkId(val);
    },
    'msg.username': function (val) {
      this.paramsErr.username = validator.checkUsername(val);
    },
    'msg.password': function (val) {
      this.paramsErr.password = validator.checkPassword(val);
    },
    'msg.email': function (val) {
      this.paramsErr.email = validator.checkEmail(val);
    },
    'msg.phone': function (val) {
      this.paramsErr.phone = validator.checkPhone(val);
    },
    deep: true
  }
}
</script>

<style>
.register-main {
    width: 250px;
    max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    opacity: 1;
    border-radius: 5px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
}

.register-title {
    height: 40px;
    border-bottom: 1px solid #f2f3f5;
    line-height: 40px;
    padding: 0 20px;
    color: #999;
    position: relative;
}

.register-text {
    color: rgba(10, 100, 200, 0.8);
    font-weight: 1000;
    font-size: 26px;
}

.register-cancel {
    font-style: normal;
    position: absolute;
    top: 0;
    right: 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 300;
    opacity: 0.5;
}

.register-cancel:hover {
    color: #333;
}

.form-control{
  padding: 8px;
  margin-top: 15px;
  height: 8px;
}

.msg-err{
  font-size: 12pt;
  text-align: left;
  color: blue;
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

.register-form{
  position: relative;
  margin-left: 30px;
  margin-right: 30px;
}

.register-footer {
    padding: 10px 20px;
    border-top: 1px solid #f2f3f5;
}

.register-footer:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
}

.register-footer button {
    border: none;
    color: #fff;
    min-width: 60px;
    height: 30px;
    border-radius: 3px;
    font-size: 13px;
    cursor: pointer;
    float: right;
    margin-left: 10px;
}

.register-footer button.register-btn {
    background-color: #549BEB;
}

.register-footer button.register-btn:hover {
    background-color: #2680e6;
}

.change {
  margin-top: 50px;
}

.link {
  color: #549BEB;
}

.link:hover {
  color: #2680e6;
  cursor: pointer;
}
</style>
