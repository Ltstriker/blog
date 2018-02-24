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
      this.state = this.$route.params.state
      if (this.$route.params.state == 1) {
        this.$http.post('/api/blog/getblog',this.$route.params)
        .then((res) => {
          this.showError(res);
          if(res.body.error !== undefined) {
            this.state = -1;
          } else {
            this.title = res.body.title;
            this.username = res.body.author;
            this.content= res.body.content;
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
          this.showError({body: {error: 'title should not be empty'}})
          return;
        } else if (this.content == '') {
          this.showError({body: {error: 'content should not be empty'}})
          return;
        }
        this.$http.post('/api/blog/editBlog', {
          id: this.$route.params.id,
          title: this.title,
          content: this.content,
          author: this.username,
          state: this.state})
        .then((res => {
          this.showError(res);
          if (this.state == 1) {
            this.$router.push('/blog/'+ this.$route.params.id)
          } else {
            this.$router.push('/blog/'+ res.body.data._id)
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
      showError: function (res) {
        console.log(res.body);
        if (res.body['error']!==null) {
          this.$modal.confirm({'title': 'error', 'content': res.body['error']}).then( res => {
            //
          }).catch( rej => {
            //
          })
        }
      }
    }
}
</script>

<style lang="css" scoped>
.editor{
  position:relative;
  margin: 0 auto;
  width: 500px;
  border: 2px red solid;
}

.editor-title{
  width: 480px;
  height: 24px;
  margin: 10px;
}

.editor-content
{
  width: 480px;
  height: 500px;
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
