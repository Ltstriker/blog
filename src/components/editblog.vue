<template lang="html">
<div class="editor">
  <input class="editor-title" placeholder="title" v-model="title"/>
  <textarea class="editor-content" placeholder="content" v-model="content"/>
  <button type="submit" id='btnInEdit' @click="finish">finish</button>
  <button type="submit" id='btnInback' @click="goBack">give up</button>
</div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      title: '',
      content: '',
      state: -1
    }
  },
  created: function () {
      this.state = this.$route.params.state;
      if (this.$route.params.state == 1) {
        this.$http.post('/api/blog/getblog',{id: this.$route.params.id, username: this.getCookie('session')})
        .then((res) => {
          this.showError(res);
          if(res.body.error !== null) {
            this.state = -1;
          } else {
            this.title = res.body.data.title;
            this.username = res.body.data.author;
            this.content= res.body.data.content;
            this.state = 1;
          }
        }).catch((rej) => {
          this.showError(rej);
          this.state = -1;
        })
      } else if(this.$route.params.state != 0){
        this.$router.go(-1);
      } else {
        if(this.getCookie('session')===null) {
          this.$modal.confirm({
            'title': 'error',
            'content': 'you have not login.If you want to continue please login at first',
            'ok': 'login',
            'cancel': 'cancel'
            }).then( res => {
              this.goToLogin()
            }).catch( rej => {
            //
            })
        } else {
          this.username = this.getCookie('session')
        }
      }
    },
    methods: {
      finish: function () {
        if(this.title=='') {
          this.showError('title should not be empty')
          return;
        } else if (this.content == '') {
          this.showError('content should not be empty')
          return;
        }
        this.$http.post('/api/blog/editBlog', {
          id: this.$route.params.id,
          title: this.title,
          content: this.content,
          author: this.username,
          state: this.state})
        .then((res => {
          if (!res.body.sign) {
            this.showError(res);
          } else {
            if (this.state == 1) {
              this.$router.push('/blog/'+ this.$route.params.id)
            } else {
              this.$router.push('/blog/'+ res.body.msg)
            }
          }
        })).catch((rej) => {
          this.showError(rej);
          this.$router.push('/')
        })
      },
      goBack: function () {
        this.$router.go(-1);
      },
      goToLogin: function () {
        this.$modal.login().then( res => {
          //
        }).catch( rej => {
          if (rej['change']) {
            this.gotoRegister()
          }
          //
        })
      },
      gotoRegister: function () {
        this.$modal.register().then( res => {
          //this.getUsername();
        }).catch( rej => {
          if (rej['change']) {
            this.goToLogin()
          }
          //this.getUsername();
        })
      },
      showError: function (msg) {
        this.$modal.confirm({'title': 'error', 'content': msg}).then( res => {
          //
        }).catch( rej => {
          //
        })
      }
    }
}
</script>

<style lang="css" scoped>
.editor{
  background-color: white;
  position:relative;
  margin: 0 auto;
  width: 60%;
  border: 1px rgba(0, 0, 0, 0.1) solid;
  box-shadow: 1px 1px 1px gray;
}

.editor-title{
  width: 98%;
  height: 24px;
  margin: 1%;
  font-size: 20pt;
}

.editor-content
{
  width: 98%;
  height: 550px;
  font-size: 16pt;
  word-wrap:break-word;
  word-break:break-all;
}

#btnInEdit{
  margin: 5px;
  height: 28px;
  font-size: 16pt;
}

#btnInback{
  margin: 5px;
  height: 28px;
  font-size: 16pt;
}

</style>
