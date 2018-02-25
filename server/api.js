"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
const blogInPage = 5;
const validator = require('../src/assets/js/validator');

const var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(13);

router.post('/api/login/trylogin',(req,res) => {
    let paramsErr = validator.checkLogin(req.body);
    if (paramsErr.err) {
      res.send({sign: false, msg: paramsErr});
    } else {
      var d = new Date();
      let change = {
        signed: true,
        signTime: d.toLocaleString()
      }
      models.User.find({username : req.body.username},
        (err,data) => {
          if(err){
            res.send({sign: false, msg: 'Something wrong happened,please retry.'});//res.send
          } else {
            if(data.length !== 1) {
              res.send({sign: false, msg: 'this user is no exist'});
            } else {
              if (bcrypt.compareSync(req.body.password, data[0].password)) {
                models.User.update({username : req.body.username}, change
                (err, data) => {
                  if (err) {
                    res.send({sign: true, msg: 'Something wrong,but not a big problem'});
                  } else {
                    res.send({sign: true, msg: ''});
                  }
                })
              } else {
                res.send({sign: false, msg: 'password is wrong'});
              }
            }
          }
      });
    }
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

router.post('/api/register/tryregister',(req,res) => {
  let paramsErr = validator.checkRegister(req.body);
  if (paramsErr.err) {
    res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
  } else {
    models.User.find({username : req.body.username},
      (err,data) => {
        if (err) {
          res.send({sign: false,msg: paramsErr,error: 'Something wrong happened'});
        } else {
          if (data.length !== 0) {
            paramsErr['username']='this username has been registered';
          }
        }
        models.User.find({id : req.body.id},
          (err, data) => {
            if (err) {
              res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
            } else {
              if (data.length !== 0) {
                paramsErr['id']='this id has been registered';
              }
            }
            models.User.find({phone : req.body.phone},
              (err, data) => {
                if (err) {
                  res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
                } else {
                  if (data.length !== 0) {
                    paramsErr['phone']='this phone has been registered';
                  }
                }
                models.User.find({email : req.body.email},
                  (err, data) => {
                    if (err) {
                      res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
                    } else {
                      if (data.length !== 0) {
                        paramsErr['email']='this email has been registered';
                      }
                    }

                    for (var item in paramsErr) {
                      if (item!=='') {
                        res.send({sign: false, msg: paramsErr, error: 'Something wrong happened'})
                      }
                    }

                    var d = new Date();
                    let newUser = new models.User({
                      id: req.body.id,
                      username: req.body.username,
                      password: bcrypt.hashSync(req.body.password, salt),
                      email: req.body.email,
                      phone: req.body.phone,
                      signed: true,
                      signTime: d.toLocaleString()
                    });

                    newUser.save((err,data)=>{
                      if (err) {
                        res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
                      } else {
                        res.send({sign: true, msg: paramsErr, error: null});
                      }
                    });
                  });
              });
          });
    });
  }
});

router.post('/api/detail/getuser', (req, res) => {
  models.User.find({username : req.body.username},
    (err, data) => {
    if (err) {
      res.send({error: 'Something wrong'});
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send({error: 'the user is not found'});
      } else {
        let params= {
          id: data[0].id,
          username: data[0].username,
          email: data[0].email,
          phone: data[0].phone
        }
        res.send({'error': null, 'data': params});
      }
    }
  })
});

router.post('/api/blog/getblog', (req, res) => {
  models.Blog.find({_id : req.body.id},
    (err, data) => {
    if (err) {
      res.send({error: 'the blog is not found'});
    } else {
      res.send({'error': null, 'data': data[0]});
    }
  })
});

router.post('/api/blog/deleteBlog', (req, res) => {
  models.User.find({username : req.body.username},
    (err, data) => {
    if (err) {
      res.send({error: 'Something wrong'});
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send({error: 'you can not edit others blog'});
      } else {
        models.Blog.remove({_id: req.body.id},
        (err,data) => {
          if (err) {
            res.send({error: 'Something wrong happened'});
          } else {
            console.log(data);
            if (data.n != 1) {
              res.send({error: 'did not find the blog'});
            } else {
              res.send({error: null})
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
      res.send({error: 'Something wrong'});
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send({error: 'not signed'});
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
                res.send({error: 'Something wrong'});
              } else {
                res.send({error: null, data:data[0]});
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
              res.send({error: 'Something wrong'});
            } else {
              res.send({error: null, 'data':data});
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
      res.send({error: 'Something wrong'});
    } else {
      if (data.length!=1 || !data[0].signed) {
        res.send({error: 'user not exist or has not login'})
      } else {
        models.Blog.find({_id : req.body.blogId},
          (err, blog) => {
          if (err) {
            res.send({error: 'Something wrong'});
          } else {
            if (blog.length != 1) {
              res.send({error: 'the blog is not found'})
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
                  res.send({error: 'the blog not exist'})
                } else if (req.body.username !== params.comments[temp_blogIndex].speaker) {
                  res.send({error: 'can not edit others comment'})
                } else {
                  newComment['id']=params.comments[temp_blogIndex].id;
                  params.comments[temp_blogIndex]=newComment;
                }
              }


              models.Blog.update({_id: req.body.blogId}, params,
                (err,data) => {
                  if (err) {
                    res.send({error: 'Something wrong'})
                  } else {
                    console.log(data);
                    res.send({error: null});
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
      res.send({error: 'Something wrong'});
    } else {
      if (data.length!=1 || !data[0].signed) {
        res.send({error: 'user not exist or has not login'})
      } else {
        models.Blog.find({_id : req.body.blogId},
          (err, blog) => {
          if (err) {
            res.send({error: 'Something wrong'});
          } else {
            if (blog.length!=1) {
              res.send({error: 'the blog is not found'})
            } else {
              var temp_blogIndex=blog[0].comments.findIndex((temp) => {
                return temp.id == req.body.commentId
              });
              if(temp_blogIndex == -1) {
                res.send({error: 'the comment is not exist'})
              } else if (blog[0].comments[temp_blogIndex].speaker != req.body.username) {
                res.send({error: 'you can not edit others comment'})
              } else {
                blog[0].comments.splice(temp_blogIndex, 1);
                models.Blog.update({_id: req.body.blogId},
                  {comments: blog[0].comments},
                  (err,data) => {
                    if (err) {
                      res.send({error: 'Something wrong'})
                    } else {
                      res.send({error: null});
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
        res.send({error: 'Something wrong'});
    } else {
      data.sort((a, b) => {
        return a.lastedit < b.lastedit;
      });
      console.log(data.length/blogInPage+0.5);
      res.send({error: null,blog: data.slice((req.body.page - 1) * blogInPage, req.body.page * blogInPage),
      totalPage: Math.ceil(data.length/blogInPage)});
    }
  });
});



module.exports = router;
