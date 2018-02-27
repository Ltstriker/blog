<template>
<div>
  <div class="blog-block">
    <div class="title">
      {{article.title}}
    </div>
    <div class="Tips" v-if='article.hide && username === article.author'>The blog has been hidden</div>
    <div v-if="username === article.author || username === 'admin'" class="operator">
      <span class="edit" v-if="username === article.author" v-on:click='edit'>edit</span>
      <span class="delete" v-if="username === article.author" v-on:click='del'>delete</span>
      <span class='hide' v-if='username === "admin"' v-on:click='changeHideForBlog'>
        <span v-if='article.hide'>show</span>
        <span v-else>hide</span>
      </span>
    </div>
    <div class="author">
      {{article.author}}
    </div>
    <hr />
    <div class="hideContent" v-if='article.hide && username !== article.author && username !== "admin"'>
      The blog has been hidden
    </div>
    <pre class="content" v-else>
      {{article.content}}
    </pre>
    <div class="lastedit">
      {{article.lastedit}}
    </div>
    <div class="goTomain">
      <span class="goToReply" v-on:click='goToReply'>reply</span>
    </div>
  </div>
  <div class="comments-box">
    <div class="commentStyle" v-for='item in article.comments':key='item.id'>
      <div v-if='username === item.speaker || username === "admin"' class="comment-operator">
        <span v-if='username === item.speaker' v-on:click='editComment(item.id,item.content)'>edit</span>
        <span v-if='username === item.speaker' v-on:click='deleteComment(item.id)'>delete</span>
        <span v-if='username === "admin"' v-on:click='changeHideForComment(item.id)'>
          <span v-if='item.hide'>show</span>
          <span v-else>hide</span>
        </span>
      </div>
      <div class="commenter">{{item.speaker}}</div>
      <div class="hideComment" v-if='item.hide && username !== "admin"'>
        The comment has been hidden
      </div>
      <pre class="commentContent" v-if='item.hide == false
        || username === item.speaker
        || username === "admin"'>{{item.content}}</pre>
      <div class="commentTime">{{item.lastedit}}</div>
    </div>
    <div id='reply-box'>
      <span class="reply-sign"></span>
      <textarea class="editor-comment" placeholder="comment" v-model='newComment'/>
      <button type="submit" id='btnComment' @click="finish">comment</button>
    </div>
  </div>
</div>
</template>

<script>
import { EventBus } from '../assets/js/event-bus.js';

export default {
  data () {
    return {
      username: '',
      article: {},
      state: 0,
      newComment: '',
      commentId: null
    }
  },
  created: function () {
    this.username = this.getCookie('session')===null?'guest':this.getCookie('session');
    this.getArticle();
    EventBus.$on('set', (val)=>{
      this.username = val;
      if (this.username === this.article.author || this.username === 'admin') {
        this.getArticle()
      }
    });
    EventBus.$on('reset', ()=>{
      this.username = 'guest';
    });
  },
  beforeDestory: function () {
    EventBus.$off('set');
    EventBus.$off('reset');
  },
  methods: {
    getArticle: function () {
      this.$http.post('/api/blog/getblog',{id: this.$route.params.id, username: this.username})
      .then((res) => {
        if(res.body.error !== null) {
          this.showError(res);
          this.$router.go(-1);
        } else {
          this.article=res.body.data;
          this.state = 1;
        }
      }).catch((rej) => {
        this.state = -1;
      })
    },
    del: function () {
      let params = {
        id: this.$route.params.id,
        username: this.username
      }
      this.$http.post('/api/blog/deleteBlog', params)
      .then((res)=> {
        this.showError(res);
        this.$router.push('/')
      }).catch((rej) => {
        this.showError(rej);
        this.$router.push('/')
      })
    },
    edit: function () {
      this.$router.push('/editblog/'+ this.$route.params.id+'/'+this.state.toString())
    },
    changeHideForBlog: function () {
      let params = {
        id: this.$route.params.id,
        username: this.username
      }
      this.$http.post('/api/blog/hideBlog', params)
      .then((res)=> {
        this.showError(res);
        this.getArticle()
      }).catch((rej) => {
        this.showError(rej);
        this.getArticle()
      })
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
        let params = {
          blogId: this.$route.params.id,
          username: this.getCookie('session'),
          commentId: val
        }
        this.$http.post('/api/blog/deleteComment',params)
        .then((res) => {
          this.showError(res);
          this.getArticle()
        }).catch((rej) => {
          this.showError(rej);
          this.getArticle()
        })
      }
    },
    changeHideForComment: function (val) {
      if(!this.getCookie('session')) {
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
        let params = {
          changeHideState: true,
          blogId: this.$route.params.id,
          username: this.getCookie('session'),
          commentId: val
        }
        this.$http.post('/api/blog/commentAtBlog',params)
        .then((res) => {
          this.showError(res);
          this.getArticle()
        }).catch((rej) => {
          this.showError(rej);
          this.getArticle()
        })
      }
    },
    finish: function () {
      if(!this.getCookie('session')) {
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
        if (this.newComment == '') {
          this.showError({body: {error: 'comment should not be empty'}})
          return;
        }
        let params = {
          changeHideState: false,
          blogId: this.$route.params.id,
          username: this.getCookie('session'),
          commentId: this.commentId,
          comment: this.newComment
        }
        this.$http.post('/api/blog/commentAtBlog',params)
        .then((res) => {
          this.showError(res);
          this.getArticle()
          this.newComment= '',
          this.commentId= null
        }).catch((rej) => {
          this.showError(rej);
          this.getArticle()
        })
      }
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

<style>
body{
  background-color: rgba(0, 0, 0, 0.01);
}

.blog-block{
  position: relative;
  background-color: white;
  margin: 0 auto;
  margin-bottom: 20px;
  width: 60%;
  border: 1px rgba(0, 0, 0, 0.1) solid;
  box-shadow: 1px 1px 1px gray;
}
.title{
  font-weight: bolder;
  font-size: 32pt;
}
.Tips {
  color: red;
}
.author{
  text-align: right;
  padding-right: 20px;
}
.content{
  width: 90%;
  padding-left: 5%;
  font-size: 16pt;
  text-align: left;
  white-space:pre-wrap;
  white-space:-moz-pre-wrap;
  white-space:-pre-wrap;
  white-space:-o-pre-wrap;
  word-wrap:break-word;
}

.hideContent {
  width: 464px;
  padding: 18px;
  font-size: 16pt;
  text-align: left;
  color: red;
}

.lastedit{
  text-align: right;
  color: gray;
  padding-right: 20px;
}

.comments-box {
  background-color: white;
  position: relative;
  margin: 0 auto;
  text-align: left;
  width: 60%;
  border: 1px rgba(0, 0, 0, 0.1) solid;
  box-shadow: 1px 1px 1px gray;
}

.commentStyle{
  border: 1px rgba(0, 0, 0, 0.1) solid;
}

.operator span {
  color: rgba(0, 0, 255, 0.5);
}

.operator span:hover {
  cursor: pointer;
  color: rgba(0, 0, 255, 0.8);
}

.comment-operator{
  float: right;
  margin-top: 2px;
  margin-right: 10px;
}

.comment-operator span {
  color: rgba(0, 0, 255, 0.5);
}

.comment-operator span:hover {
  cursor: pointer;
  color: rgba(0, 0, 255, 0.8);
}

.commenter{
  width: 490px;
  padding: 5px;
}
.commentTime{
  text-align: right;
  padding-right: 10px;
}

.commentContent{
  width: 92%;
  padding-left: 18px;
  font-size: 16pt;
  text-align: left;
  word-wrap:break-word;
  word-break:break-all;
}

.hideComment {
  width: 92%;
  padding-left: 18px;
  font-size: 12pt;
  text-align: left;
  word-wrap:break-word;
  word-break:break-all;
  color: red;
}

.goToReply{
  padding: 5px;
  color: rgba(0, 0, 255, 0.5);
}

.goToReply:hover{
  cursor: pointer;
  color: rgba(0, 0, 255, 0.8);
}

#reply-box{
  position: relative;
  width: 100%;
  text-align: left;
  border: 1px rgba(0, 0, 0, 0.1) solid;
}

.editor-comment{
  position: relative;
  margin: 0 auto;
  font-size: 16pt;
  width: 98%;
  height: 120px;
  margin-top: 5px;
  margin-left: 0.5%;
}

#btnComment{
  height: 23px;
  width: 92px;
  font-size: 14pt;
  margin: 10px;
}
</style>
