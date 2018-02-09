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
      <span class="goToReply" v-on:click='goToReply'>reply</span>
    </div>
  </div>
  <div class="commentStyle" v-for='item in article.comments':key='item.id'>
    <div v-if='getRightForComment' class="comment-operator">
      <span v-on:click='editComment(item.id,item.content)'>edit</span>
      <span v-on:click='deleteComment(item.id)'>delete</span>
    </div>
    <div class="commenter">{{item.speaker}}</div>
    <div class="commentContent">{{item.content}}</div>
    <div class="commentTime">{{item.lastedit}}</div>
  </div>
  <div id='reply-box'>
    <textarea class="editor-comment" placeholder="comment" v-model='newComment'/>
    <button type="submit" id='btnComment' @click="finish">comment</button>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      article: {},
      state: 0,
      newComment: '',
      commentId: null
    }
  },
  created: function () {
    this.getArticle()
    },
  computed: {
    getRight: function () {
      if(this.article!=={} && !!this.article.author
        &&this.article.author === this.getCookie('session')) {
        return true
      } else {
        return false
      }
    },
    getRightForComment: function () {
      return true;
    }
  },
  methods: {
    getArticle: function () {
      this.$http.post('/api/blog/getblog',this.$route.params)
      .then((res) => {
        if(res.body.err !== undefined) {
          this.state = -1;
        } else {
          this.article=res.body;
          this.state = 1;
        }
      }).catch((rej) => {
        this.state = -1;
      })
    },
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
    },
    goToReply: function () {
      this.commentId = null
      this.newComment = ''
      document.getElementById('reply-box').scrollIntoView()
    },
    editComment: function (val,con) {
      this.commentId = val
      this.newComment = con
      document.getElementById('reply-box').scrollIntoView()
    },
    deleteComment: function (val) {
      if(!this.getCookie('session')) {
        //ask for login
      } else {
        let params = {
          blogId: this.$route.params.id,
          username: this.getCookie('session'),
          commentId: val
        }
        this.$http.post('/api/blog/deleteComment',params)
        .then((res) => {
          console.log(res);
          this.getArticle()
        }).catch((rej) => {
          this.getArticle()
        })
      }
    },
    finish: function () {
      if(!this.getCookie('session')) {
        //ask for login
      } else {
        let params = {
          blogId: this.$route.params.id,
          username: this.getCookie('session'),
          commentId: this.commentId,
          comment: this.newComment
        }
        this.$http.post('/api/blog/commentAtBlog',params)
        .then((res) => {
          this.getArticle()
          this.newComment= '',
          this.commentId= null
        }).catch((rej) => {
          this.getArticle()
        })
      }
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

.commentStyle{
  position: relative;
  margin: 0 auto;
  border: 2px yellow solid;
  width: 500px;
  text-align: left;
}

.comment-operator{
  position: absolute;
  top: 2px;
  right: 10px;
}

.commenter{
  width: 490px;
  padding: 5px;
}
.commentTime{
  width: 490px;
  text-align: right;
  padding-right: 10px;
}

.commentContent{
  width: 464px;
  padding-left: 18px;
  font-size: 16pt;
  text-align: left;
  word-wrap:break-word;
  word-break:break-all;
}

.goToReply{
  padding: 5px;
  color: blue;
}

.goToReply:hover{
  cursor: pointer;
}

#reply-box{
  position: relative;
  margin: 0 auto;
  border: 2px black solid;
  width: 500px;
  text-align: left;
}

.editor-comment{
  font-size: 16pt;
  width: 480px;
  height: 120px;
  margin: 9px;
  margin-bottom: 0;
}

#btnComment{
  height: 23px;
  width: 92px;
  font-size: 14pt;
  margin: 5px;
  margin-top: 3px;
  margin-left: 395px;
}
</style>
