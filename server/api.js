// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
const blogInPage = 5;

/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/

// 创建账号接口
router.post('/api/login/trylogin',(req,res) => {
    var d = new Date();
    let change = {
      signed: true,
      signTime: d.toLocaleString()
    }
    models.User.update({username : req.body.username, password : req.body.password},
      change,
      (err,data) => {
        if(err){
          res.send(err);//res.send
        } else {
          if(data.n == 1) {
            res.send('succeed')
          } else {
            res.send('false')
          }
        }
    });
});

router.post('/api/detail/trylogout',(req,res) => {
  var d = new Date();
  let change = {
    signed: false,
    signTime: d.toLocaleString()
  }
  models.User.update({username : req.body.username},
    change,
    (err,data) => {
      if(err){
        res.send(err);//res.send
      } else {
        if(data.n == 1) {
          res.send('succeed')
        } else {
          res.send('false')
        }
      }
  });
});

// register
router.post('/api/register/tryregister',(req,res) => {
    models.User.find({username : req.body.username},
      (err,data) => {
        if (err) {
          res.send(err);
        } else {
          if (data.length !== 0) {
            res.send('false')
          } else {
            var d = new Date();
            let newUser = new models.User({
              id: req.body.id,
              username: req.body.username,
              password: req.body.password,
              email: req.body.email,
              phone: req.body.phone,
              signed: true,
              signTime: d.toLocaleString()
            });

            newUser.save((err,data)=>{
              if (err) {
                res.send(err);
              } else {
                res.send('succeed');
              }
            });
          }
        }
    });
});

router.post('/api/detail/getuser', (req, res) => {
  models.User.find({username : req.body.username},
    (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send('error');
      } else {
        res.send(data[0]);
      }
    }
  })
});

router.post('/api/blog/getblog', (req, res) => {
  models.Blog.find({_id : req.body.id},
    (err, data) => {
    if (err) {
      res.send({err: 'the blog is not found'});
    } else {
      res.send(data[0]);
    }
  })
});

router.post('/api/blog/deleteBlog', (req, res) => {
  models.User.find({username : req.body.username},
    (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send('error');
      } else {
        models.Blog.remove({_id: req.body.id},
        (err,data) => {
          if (err) {
            res.send(err);
          } else {
            if (data.length != 1) {
              res.send('error');
            } else {
              res.send(data[0])
            }
          }
        })
      }
    }
  })
});

router.post('/api/blog/editBlog', (req, res) => {
  models.User.find({username : req.body.author},
    (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send({err: 'not signed'});
      } else {
        var d = new Date();
        let params = {
          lastedit: d.toLocaleString()
        };
        if(req.body.title!=undefined) {
          params['title'] = req.body.title;
        }
        if(req.body.content!=undefined) {
          params['content'] = req.body.content;
        }

        if(req.body.state == 1) {
          //edit
          models.Blog.update({_id: req.body.id, author: req.body.author}, params,
            (err, data) => {
              if (err) {
                res.send({err: 'Something wrong'});
              } else {
                res.send(data[0]);
              }
            })
        } else {
          //add
          params['author']=req.body.author;
          params['comments']=new Array();
          params['totalComment']= 0;
          let newBlog = new models.Blog(params)
          newBlog.save((err,data)=>{
            if (err) {
              res.send({err: 'Something wrong'});
            } else {
              console.log(data);
              res.send(data);
            }
          });
        }
      }
    }
  })
});

router.post('/api/blog/commentAtBlog', (req,res) => {
  models.User.find({username : req.body.username},
  (err, data) => {
    if(err) {
      res.send({err: 'Something wrong'});
    } else {
      if (data.length!=1 || !data[0].signed) {
        res.send({err: 'user not exist or has not login'})
      } else {
        models.Blog.find({_id : req.body.blogId},
          (err, blog) => {
          if (err) {
            res.send({err: 'Something wrong'});
          } else {
            if (blog.length != 1) {
              res.send({err: 'the blog is not found'})
            } else {
              var d = new Date();
              let params= {
                comments : blog[0].comments,
                totalComment: blog[0].totalComment
              };
              let newComment = {
                lastedit: d.toLocaleString(),
                speaker: req.body.username,
                content: req.body.comment
              }

              console.log(req.body);

              if (req.body.commentId == null) {
                newComment['id']= ++params.totalComment;
                params.comments.push(newComment);
              } else {
                let temp_blogIndex = params.comments.findIndex((temp) => {
                  return temp.id == req.body.commentId
                });
                if (newComment['id'] == -1) {
                  res.send({err: 'the blog not exist'})
                } else if (req.body.username !== params.comments[temp_blogIndex].speaker) {
                  res.send({err: 'can not edit others comment'})
                } else {
                  newComment['id']=params.comments[temp_blogIndex].id;
                  params.comments[temp_blogIndex]=newComment;
                }
              }


              models.Blog.update({_id: req.body.blogId}, params,
                (err,data) => {
                  if (err) {
                    res.send({err: 'Something wrong'})
                  } else {
                    console.log(data);
                    res.send(data[0]);
                  }
                })
            }
          }
        })
      }
    }
  })
}),

router.post('/api/blog/deleteComment', (req, res) => {
  models.User.find({username : req.body.username},
  (err, data) => {
    if(err) {
      res.send({err: 'Something wrong'});
    } else {
      if (data.length!=1 || !data[0].signed) {
        res.send({err: 'user not exist or has not login'})
      } else {
        models.Blog.find({_id : req.body.blogId},
          (err, blog) => {
          if (err) {
            res.send({err: 'Something wrong'});
          } else {
            if (blog.length!=1) {
              res.send({err: 'the blog is not found'})
            } else {
              var temp_blogIndex=blog[0].comments.findIndex((temp) => {
                return temp.id == req.body.commentId
              });
              if(temp_blogIndex == -1) {
                res.send({err: 'the comment is not exist'})
              } else if (blog[0].comments[temp_blogIndex].speaker != req.body.username) {
                res.send('you can not edit others comment');
              } else {
                blog[0].comments.splice(temp_blogIndex, 1);
                models.Blog.update({_id: req.body.blogId},
                  {comments: blog[0].comments},
                  (err,data) => {
                    if (err) {
                      res.send({err: 'Something wrong'})
                    } else {
                      res.send(data[0]);
                    }
                  })
              }
            }
          }
        })
      }
    }
  })
}),

router.post('/api/main/bloglist', (req, res) => {
  models.Blog.find({title: new RegExp(req.body.searchString)},(err,data) =>{
    if (err) {
        res.send(err);
    } else {
      data.sort((a, b) => {
        return a.lastedit < b.lastedit;
      });
      res.send({blog: data.slice((req.body.page - 1) * blogInPage, req.body.page * blogInPage),
      totalPage: parseInt(data.length/blogInPage) + 1});
    }
  });
});



module.exports = router;
