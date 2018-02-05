<template>
<div>
  <div id="list">
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
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      limit: 0,
      content: []
    }
  },
  created: function () {
    this.limit +=10
  },
  watch: {
    limit: function(val) {
      this.$http.get('/api/main/bloglist')
      .then((res) => {
        this.content = res.body
      }).catch((rej) => {
        console.log(rej)
      })
    }
  },
  methods: {
    newBlog: function () {
      this.$router.push('/editblog/0/0')
    }
  }

}
</script>

<style>
#list{
  position: relative;
  margin: 0 auto;
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
</style>
