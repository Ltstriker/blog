<template>
  <div>
    <div class="detail-main">
      <div class="detail-title">
        <h1 class="detail-text">detail</h1>
        <i class="detail-cancel" @click="cancelFn">x</i>
      </div>
      <div class="form">
        <div id ="msg" v-for="(key,val) in msg">{{val}} : {{key}}</div>
      </div>
      <div class="detail-footer">
        <button class="detail-btn" @click="cancelFn">ok</button>
        <button class="logout-btn" @click="logout">logout</button>
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
    logout: function () {
      this.$http.post('/api/detail/trylogout',{username: this.getCookie('session')})
      .then((res) => {
        this.delCookie('session');
        this.$emit('$ok', this.$el,{err: null, change: false})
      }).catch((rej) => {
        this.delCookie('session');
        this.$emit('$ok', this.$el,{err: 'err', change: false})
      })
    },
    cancelFn: function () {
      this.$emit('$cancel', this.$el,{err: 'cancel', change: false})
    }
  },
  created: function () {
    if (this.getCookie('session')){
      this.$http.post('/api/detail/getuser', {username: this.getCookie('session')})
      .then((res) => {
        if(res.body.data === undefined){
          this.err = true
        } else {
          this.err = false
          this.msg = {
            "id": res.body.data.id,
            "username": res.body.data.username,
            "email": res.body.data.email,
            "phone": res.body.data.phone
          }
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
.detail-main {
    width: 250px;
    max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    opacity: 1;
    border-radius: 5px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
}

.detail-title {
    height: 40px;
    border-bottom: 1px solid #f2f3f5;
    line-height: 40px;
    padding: 0 20px;
    color: #999;
    position: relative;
}

.detail-text {
    color: rgba(10, 100, 200, 0.8);
    font-weight: 1000;
    font-size: 26px;
}

.detail-cancel {
    font-style: normal;
    position: absolute;
    top: 0;
    right: 20px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 300;
    opacity: 0.5;
}

.detail-cancel:hover {
    color: #333;
}

#msg{
  text-align: left;
}

.form{
  position: relative;
  margin: 30px;
}

.detail-footer {
    padding: 10px 20px;
    border-top: 1px solid #f2f3f5;
}

.detail-footer:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
}

.detail-footer button {
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

.detail-footer button.detail-btn {
    background-color: #549BEB;
}

.detail-footer button.detail-btn:hover {
    background-color: #2680e6;
}

.detail-footer button.logout-btn {
  float: left;
    background-color: #549BEB;
}

.detail-footer button.logout-btn:hover {
    background-color: #2680e6;
}
</style>
