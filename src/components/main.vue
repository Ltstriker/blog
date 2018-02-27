<template>
<div id="list-main">
  <div class="search">
    <input id="searchBox" type="text" name="search" placeholder='search' v-model='limit'>
    <span class="goSearch" v-on:click='search'>search</span>
  </div>
  <div id="list">
    <div v-for="item in content" :key = 'item._id'>
      <router-link :to='{name: "blog", params:{id: item._id}}'>
        <div class="block">
        <span class="list-title">{{item.title}}</span>
        <span class="list-author">author: {{item.author}}</span>
        <span class="list-lastedit">last edit at: {{item.lastedit}}</span>
        <span class="list-comment">
          <span class="list-commentNumber">{{item.totalComments}}</span>
        </span>
        </div>
      </router-link>
    </div>
    <div v-if='content.length === 0' class="noBlog">
      No blog found
    </div>
  </div>
  <div class="newBlog" v-on:click='newBlog'></div>
  <div class="page">
    <span class="prePage" v-on:click="changePage(-1)"></span>
    <input id="pageNumber" type="text" name="pageNumber" v-model='temppage'>
    <span id="btnForPage" v-on:click='changePage(0)'>go</span>
    <span class="totalPage">/{{totalPage}}</span>
    <span class="nextPage" v-on:click='changePage(1)'></span>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      limit: '',
      page: 1,
      temppage: 1,
      content: [],
      totalPage: 0
    }
  },
  created: function () {
    this.getBlogList({});
  },
  methods: {
    newBlog: function () {
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
        this.$router.push('/editblog/0/0')
      }
    },
    search: function () {
      this.page = this.temppage = 1;
      this.getBlogList();
    },
    getBlogList: function () {
      this.$http.post('/api/main/bloglist', {searchString: this.limit,page: this.page})
      .then((res) => {
        this.showError(res);
        this.content = res.body.blog;
        this.totalPage = res.body.totalPage;

        if (this.totalPage==0) {
          this.page = this.temppage = 0;
        }
      }).catch((rej) => {
        this.showError(rej)
      })
    },
    changePage: function (val) {
      if (val == 0) {
        if(this.temppage>0 && this.temppage <= this.totalPage) {
          this.page = this.temppage;
          this.getBlogList();
        } else {
          this.showError({body: {error: 'page '+this.temppage.toString()+' is not exist!'}});
          this.temppage = this.page;
        }
      } else if (val + this.page <= this.totalPage && val + this.page > 0) {
        this.temppage= this.page += val
        this.getBlogList();
      }
    },
    goToLogin: function () {
      this.$modal.login().then( res => {
      }).catch( rej => {
        if (rej['change']) {
          this.gotoRegister()
        }
      })
    },
    gotoRegister: function () {
      this.$modal.register().then( res => {
      }).catch( rej => {
        if (rej['change']) {
          this.goToLogin()
        }
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
#list-main{
  position: relative;
  margin: 0 auto;
  top: 30px;
  width: 60%;
}

#list {
  position: relative;
  width: 100%;
}

.block{
  position: relative;
  width: 99%;
  height: 100px;
  font-family: serif;
  box-shadow: -2px -2px 2px green inset,
              2px 2px 2px green inset;
  margin-top: 2px;
  animation-duration: 0.3s;
  background-color: rgba(0,255,0,0.1);
}

.block:hover{
  box-shadow: -2px -2px 2px green inset,
              2px 2px 2px green inset,
              0px 30px 88px rgba(0,255,0,0.3) inset;
}

.noBlog {
  position: relative;
  width: 99%;
  height: 50px;
  box-shadow: -2px -2px 2px green inset,
              2px 2px 2px green inset;
  margin-top: 2px;
  font-size: 32pt;
  font-family: serif;
  font-weight: bolder;
  background-color: rgba(0,255,0,0.1);
}

.list-lastedit{
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.list-author{
  position: absolute;
  bottom: 30px;
  left: 10px;
}
.list-title{
  position: absolute;
  left: 10px;
  font-size: 32pt;
}

.list-comment {
  position: absolute;
  background-image: url('../assets/img/message.png');
  right: 35px;
  top: 10px;
  height: 25px;
  width: 25px;
  background-repeat: no-repeat;
  background-size: 88%;
}

.list-commentNumber {
  position: absolute;
  right: -10px;
}

.newBlog{
  position: absolute;
  right: -45px;
  top: 30px;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  margin-left: 3px;
  background-image: url('../assets/img/newBlog.jpg');
  background-size: 30px 30px;
}
.newBlog:hover{
  cursor: pointer;
}

.search{
  position: absolute;
  top: -35px;
  right: 10px;
  height: 27px;
  width: 225px;
  text-align: left;
  border-radius: 15px;
  box-shadow: -2px -2px 2px rgba(0, 0, 255, 0.8) inset,
              2px 2px 2px rgba(0, 0, 255, 0.8) inset,
              0px 30px 88px rgba(0,255,0,0.5) inset;
}

#searchBox {
  position: absolute;
  left: 3.5px;
  top: 3px;
  border-radius: 10px;
  padding-left: 5px;
  box-shadow: 2px 2px 2px green inset,
              0px 30px 88px rgba(0,255,0,0.3) inset;
}

.goSearch {
  position: absolute;
  top: 3.5px;
  right: 4px;
  border-radius: 6px;
  animation-duration: 0.3s;
  box-shadow: -2px -2px 2px blue inset,
              2px 2px 2px blue inset,
              0px 30px 88px rgba(0, 0, 255,0.3) inset;
}

.goSearch:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.page{
  color: blue;
  position: relative;
  text-align: center;
  margin: 0 auto;
  margin-top: 10px;
  height: 27px;
  width: 148px;
  background-color: white;
  box-shadow: -2px -2px 2px black inset,
              2px 2px 2px black inset,
              0px -10px 8px rgba(0,0,0,0.2) inset,
              0px 90px 88px rgba(0,0,0,0.3) inset;
}

.prePage{
  position: absolute;
  left: 5px;
  top: 2px;
  width: 25px;
  height: 20px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  background-color: rgba(255,255,255,0.2);
  background-image: url('../assets/img/pre.png');
  background-position: -1px -4px;
  background-size: 110%;
  animation-duration: 0.3s;
}

.prePage:hover{
  cursor: pointer;
  transform: scale(1.05);
}

.nextPage{
  position: absolute;
  right: 5px;
  top: 2px;
  width: 25px;
  height: 20px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  background-color: rgba(255,255,255,0.2);
  background-image: url('../assets/img/next.png');
  background-position: -1px -4px;
  background-size: 110%;
  animation-duration: 0.3s;
}

.nextPage:hover{
  cursor: pointer;
  transform: scale(1.05);
}

#pageNumber{
  position: absolute;
  top: 2px;
  left: 38px;
  border-radius: 5px;
  width: 20px;
  height: 15px;
}

.totalPage {
  position: absolute;
  top: 3px;
  left: 68px;
}

#btnForPage {
  position: absolute;
  left: 90px;
  top: 3px;
  color: green;
  height: 20px;
  width: 20px;
  background-color: black;
  border-radius: 50%;
  box-shadow: -2px -2px 2px rgba(0,0,0,0.2) inset,
              2px 2px 2px rgba(0,0,0,0.3) inset,
              -10px -10px 8px white inset,
              10px 10px 88px white inset;
  animation-duration: 0.3s;
}

#btnForPage:hover {
  cursor: pointer;
  transform: scale(1.1);
}

</style>
