<template>
<div>
  <div id="list">
    <div class="search">
      <input id="searchBox" type="text" name="search" placeholder='search' v-model='limit'>
    </div>
    <div v-for="item in content" :key = 'item._id'>
      <router-link :to='{name: "blog", params:{id: item._id}}'>
        <div class="block">
        <span class="list-title">{{item.title}}</span>
        <span class="list-author">author: {{item.author}}</span>
        <span class="list-lastedit">last edit at: {{item.lastedit}}</span>
        </div>
      </router-link>
    </div>
    <div class="newBlog" v-on:click='newBlog'></div>
    <div class="page">
      <span class="prePage" v-on:click="changePage(-1)"><<</span>
      <input id="pageNumber" type="text" name="pageNumber" v-model='temppage'>
      <span id="btnForPage" v-on:click='changePage(0)'>go</span>
      <span class="totalPage">/{{totalPage}}</span>
      <span class="nextPage" v-on:click='changePage(1)'>>></span>
    </div>
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
  watch: {
    limit: function(val) {
      this.getBlogList();
    },
    page: function(val) {
      this.temppage = this.page;
      this.getBlogList();
    }
  },
  methods: {
    newBlog: function () {
      this.$router.push('/editblog/0/0')
    },
    getBlogList: function () {
      this.$http.post('/api/main/bloglist', {searchString: this.limit,page: this.page})
      .then((res) => {
        console.log(res.body);
        this.content = res.body.blog;
        this.totalPage = res.body.totalPage;
      }).catch((rej) => {
        console.log(rej)
      })
    },
    changePage: function (val) {
      if(val == 0) {
        if(this.temppage>0 && this.temppage <= this.totalPage) {
          this.page = this.temppage;
        }
      } else if (val + this.page <= this.totalPage && val + this.page > 0) {
        this.page +=val
      }
    }
  }

}
</script>

<style>
#list{
  position: relative;
  margin: 0 auto;
  top: 50px;
  width: 500px;
  border: 2px solid green;
}

.block{
  position: relative;
  width: 500px;
  height: 100px;
  border: 2px solid red;
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
.block:hover{
  background-color: rgba(0,0,0,0.2)
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
  top: -30px;
  right: 5px;
  height: 23px;
  width: 163px;
  border: 2px solid black;
}

.page{
  color: blue;
  left: 150px;
  position: absolute;
  bottom: -30px;
  height: 23px;
  width: 163px;
  border: 2px solid black;
}

.prePage{
  border: 2px solid yellow;
}
.nextPage{
  border: 2px solid yellow;
}

#pageNumber{
    width: 20px;
    height: 20px;
}

</style>
