<template>
  <div>
    <div class="login-main">
      <div class="login-title">
        <h1 class="login-text">login</h1>
        <i class="login-cancel" @click="cancelFn">x</i>
      </div>
      <div class="form">
        <input class="form-control" id="usernameInlogin" placeholder="username" v-model="msg.username">
        <input type="password" class="form-control" id="passwordInLogin" placeholder="password" v-model="msg.password">
        <div class="LoginErr msg-err" v-if='paramsErr.err!==""'>{{paramsErr.err}}</div>
      </div>
      <div class="login-footer">
        <button class="login-btn" @click="login">login</button>
        <div class="change">
          do not have an account?hit
          <span class='link' @click="gotoRegister">here</span>
          to register
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      msg: {
        username: '',
        password: ''
      },
      paramsErr: {
        err: ''
      }
    }
  },
  methods: {
    login () {
      if (this.msg.username==='') {
        this.paramsErr.err = 'username should not be empty';
        return;
      } else if (this.msg.password === '') {
        this.paramsErr.err = 'password should not be empty'
        return;
      }

      let params = {
        username: this.msg.username,
        password: this.msg.password
      }

      this.$http.post('/api/login/trylogin', params)
      .then((res) => {
        if(res.body.sign) {
          this.paramsErr.err = '';
          let expireDays = 1000 * 60 * 60 * 24 * 15;
          this.setCookie('session',this.msg.username, expireDays);
          this.$emit('$ok', this.$el,{err: null, change: false})
        } else {
          this.paramsErr.err = res.body.msg;
        }
      })
      .catch((reject) => {
        this.$emit('$ok', this.$el,{err: 'err', change: false})
      })
    },
    cancelFn: function () {
      this.$emit('$cancel', this.$el,{err: 'cancel', change: false})
    },
    gotoRegister: function () {
      this.$emit('$cancel', this.$el,{err: 'change', change: true})
    }
  }
}
</script>

<style>
.login-main {
    width: 250px;
    max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    opacity: 1;
    border-radius: 5px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
}

.login-title {
    height: 40px;
    border-bottom: 1px solid #f2f3f5;
    line-height: 40px;
    padding: 0 20px;
    color: #999;
    position: relative;
}

.login-text {
    color: rgba(10, 100, 200, 0.8);
    font-weight: 1000;
    font-size: 26px;
}

.login-cancel {
    font-style: normal;
    position: absolute;
    top: 0;
    right: 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 300;
    opacity: 0.5;
}

.login-cancel:hover {
    color: #333;
}

.form-control{
  padding: 8px;
  margin-top: 15px;
  height: 8px;
}

#usernameInlogin{
}

.msg-err{
  font-size: 12pt;
  text-align: left;
  color: blue;
}

#passwordInLogin{
}

.form{
  position: relative;
  margin: 30px;
}

.login-footer {
    padding: 10px 20px;
    border-top: 1px solid #f2f3f5;
}

.login-footer:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
}

.login-footer button {
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

.login-footer button.login-btn {
    background-color: #549BEB;
}

.login-footer button.login-btn:hover {
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
