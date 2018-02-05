<template>
<div>
  <div class="blog-block">
    <div class="title">
      {{article.title}}
    </div>
    <div v-show='getRight' id="operator">
      <span class="edit" v-on:click='edit'>edit</span>
      <span class="delete" v-on:click='del'>delete</span>
    </div>
    <div class="author">
      {{article.author}}
    </div>
    <div class="content">
      {{article.content}}
    </div>
    <div class="lastedit">
      {{article.lastedit}}
    </div>
    <div class="goTomain">
      <router-link :to="{ name: 'main', params: {} }">Back</router-link>
    </div>
  </div>

</div>
</template>

<script>
export default {
  data () {
    return {
      article: {},
      state: 0
    }
  },
  created: function () {
      this.$http.post('/api/blog/getblog',this.$route.params)
      .then((res) => {
        if(res.body.err == undefined) {
          this.state = -1;
        } else {
          this.article=res.body;
          this.state = 1;
        }
      }).catch((rej) => {
        this.state = -1;
      })
    },
  computed: {
    getRight: function () {
      if(this.article!=={} && !!this.article.author
        &&this.article.author === this.getCookie('session')) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    del: function () {
      let params = {
        id: this.$route.params.id,
        username: this.getCookie('session')
      }
      this.$http.post('/api/blog/deleteBlog', params)
      .then((res)=> {
        this.$router.push('/')
      }).catch((rej) => {
        this.$router.push('/')
      })
    },
    edit: function () {
      this.$router.push('/editblog/'+ this.$route.params.id+'/'+this.state.toString())
    }
  }
}
</script>

<style>
.blog-block{
  position: relative;
  margin: 0 auto;
  width: 500px;
  border: 2px red solid;
}
.title{
  font-size: 32pt;
}
.author{
  text-align: right;
  padding-right: 20px;
}
.content{
  width: 464px;
  padding: 18px;
  font-size: 16pt;
  text-align: left;
  word-wrap:break-word;
  word-break:break-all;
}
.lastedit{
  text-align: right;
  padding-right: 20px;
}
</style>
