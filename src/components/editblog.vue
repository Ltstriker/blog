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
          if(res.body.err == undefined) {
            this.state = -1;
          } else {
            this.title=res.body.title;
            this.username = res.body.author;
            this.content= res.body.content;
            this.state = 1;
          }
        }).catch((rej) => {
          this.state = -1;
        })
      } else if(this.$route.params.state != 0){
        this.$router.go(-1);
      } else {
        if(this.getCookie('session')===null) {
          //提示未登录
        } else {
          this.username = this.getCookie('session')
        }
      }

    },
    methods: {
      finish: function () {
        this.$http.post('/api/blog/editBlog', {
          id: this.$route.params.id,
          title: this.title,
          content: this.content,
          author: this.username,
          state: this.state})
        .then((res => {
          if (this.state == 1) {
            this.$router.push('/blog/'+ this.$route.params.id)
          } else {
            this.$router.push('/blog/'+ res.body._id)
          }
        })).catch((rej) => {
          this.$router.push('/')
        })
      },
      goBack: function () {
        this.$router.go(-1);
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
