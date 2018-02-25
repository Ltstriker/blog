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
    <div class="hideContent" v-if='article.hide && username !== article.author && username !== "admin"'>
      The blog has been hidden
    </div>
    <div class="content" v-else>
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
    <div class="commentContent" v-if='item.hide == false
      || username === item.speaker
      || username === "admin"'>{{item.content}}</div>
    <div class="commentTime">{{item.lastedit}}</div>
  </div>
  <div id='reply-box'>
    <textarea class="editor-comment" placeholder="comment" v-model='newComment'/>
    <button type="submit" id='btnComment' @click="finish">comment</button>
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
.blog-block{
  position: relative;
  margin: 0 auto;
  width: 500px;
  border: 2px red solid;
}
.title{
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
  width: 464px;
  padding: 18px;
  font-size: 16pt;
  text-align: left;
  word-wrap:break-word;
  word-break:break-all;
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
  padding-right: 20px;
}

.commentStyle{
  position: relative;
  margin: 0 auto;
  border: 2px yellow solid;
  width: 500px;
  text-align: left;
}

.operator span:hover {
  cursor: pointer;
}

.comment-operator{
  position: absolute;
  top: 2px;
  right: 10px;
}

.comment-operator span:hover {
  cursor: pointer;
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

.hideComment {
  width: 464px;
  padding-left: 18px;
  font-size: 12pt;
  text-align: left;
  word-wrap:break-word;
  word-break:break-all;
  color: red;
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
