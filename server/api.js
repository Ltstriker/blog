"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
const validator = require('../src/assets/js/validator');

const bcrypt = require('bcryptjs');
const blogInPage = 5;
const salt = bcrypt.genSaltSync(13);

const admin = 'admin';//make the account at DB and then change here

router.post('/api/login/trylogin',(req,res) => {
    let paramsErr = validator.checkLogin(req.body);
    if (paramsErr.err) {
      res.send({sign: false, msg: 'the user or password is not valid'});
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
              res.send({sign: false, msg: 'the user is not exist'});
            } else {
              if (bcrypt.compareSync(req.body.password, data[0].password)) {
                models.User.update({username : req.body.username}, change,
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
  var errSign = false;
  if (paramsErr.err) {
    res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
  } else {
    models.User.find({username : req.body.username},
      (err,data) => {
        if (err) {
          res.send({sign: false,msg: paramsErr,error: 'Something wrong happened'});
        } else {
          if (data.length !== 0) {
            errSign = true;
            paramsErr['username']='this username has been registered';
          }

          models.User.find({id : req.body.id},
            (err, data) => {
              if (err) {
                res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
              } else {
                if (data.length !== 0) {
                  errSign = true;
                  paramsErr['id']='this id has been registered';
                }

                models.User.find({phone : req.body.phone},
                  (err, data) => {
                    if (err) {
                      res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
                    } else {
                      if (data.length !== 0) {
                        errSign = true;
                        paramsErr['phone']='this phone has been registered';
                      }

                      models.User.find({email : req.body.email},
                        (err, data) => {
                          if (err) {
                            res.send({sign: false,msg: paramsErr, error: 'Something wrong happened'});
                          } else {
                            if (data.length !== 0) {
                              errSign = true;
                              paramsErr['email']='this email has been registered';
                            }

                            if (errSign) {
                              res.send({sign: false, msg: paramsErr, error: 'Something wrong happened'})
                              return;
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
                          }
                        });
                    }
                  });

              }
            });

        }
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
  if(req.body.username==undefined||req.body.username==null) {
    res.send({error: "something wrong happan,please retry"});
  } else {
    models.Blog.find({_id : req.body.id},
      (err, data) => {
      if (err) {
        res.send({error: 'something wrong'});
      } else {
        if (data.length == 1) {
          if(data[0].hide&&req.body.username!=admin&&req.body.username!=data[0].author) {
            data[0].content = ''
          }

          for (var item in data[0].comments) {
            if (item.hide&&req.body.username!=admin&&req.body.username!=data[0].speaker) {
              item.content= '';
            }
          }
          res.send({'error': null, 'data': data[0]});
        } else {
          res.send({error: 'the blog is not found'});
        }
      }
    })
  }
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

router.post('/api/blog/hideBlog', (req, res) => {
  //next({error: "wwww"});
  models.User.find({username : req.body.username},
    (err, data) => {
    if (err) {
      res.send({error: 'Something wrong'});
    } else {
      if (data.length != 1 || !data[0].signed) {
        res.send({error: 'not signed'});
      } else if (req.body.username !== admin) {
        res.send({error: 'no right to operate'});
      } else {
        models.Blog.find({_id : req.body.id},
          (err, data) => {
          if (err) {
            res.send({error: 'the blog is not found'});
          } else {
            if (data.length !== 1) {
              res.send({error: 'the blog is not found'});
            } else {
              let signForHide = !data[0].hide;
              models.Blog.update({_id : req.body.id}, {hide: signForHide},
                (err, data) => {
                if (err) {
                  res.send({error: 'something wrong'});
                } else {
                  if (data.n == 1) {
                    res.send({'error': null});
                  } else {
                    res.send({error: 'the blog is not found'});
                  }
                }
              })
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
          params['hide']= false;

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
        res.send({error: 'user not exist or has not logined'})
      } else {
        models.Blog.find({_id : req.body.blogId},
          (err, blog) => {
          if (err) {
            res.send({error: 'Something wrong'});
          } else {
            if (blog.length != 1) {
              res.send({error: 'the blog is not found'})
            } else if (req.body.commentId==null &&!!req.body.changeHideState) {
              res.send({error: 'Something wrong'})
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

              if (req.body.commentId == null) {
                //new one
                newComment['id']= ++params.totalComment;
                newComment['hide']= false;
                params.comments.push(newComment);
              } else {
                //edit
                let temp_blogIndex = params.comments.findIndex((temp) => {
                  return temp.id == req.body.commentId
                });
                if (temp_blogIndex == -1) {
                  res.send({error: 'the comment not exist'})
                  return;
                } else if (req.body.username!== admin && req.body.username !== params.comments[temp_blogIndex].speaker) {
                  res.send({error: 'can not edit others comment'});
                  return;
                } else {
                  newComment['id']= params.comments[temp_blogIndex].id;
                  newComment['hide']= params.comments[temp_blogIndex].hide;
                  if (req.body.username == admin && req.body.changeHideState) {
                    newComment['hide']= !newComment['hide'];
                    newComment['lastedit']= params.comments[temp_blogIndex].lastedit;
                    newComment['content']= params.comments[temp_blogIndex].content;
                    newComment['speaker']= params.comments[temp_blogIndex].speaker;
                  }
                  params.comments[temp_blogIndex]=newComment;
                }
              }

              models.Blog.update({_id: req.body.blogId}, params,
                (err,data) => {
                  if (err) {
                    res.send({error: 'Something wrong'})
                  } else {
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
      let blogList = new Array();
      for (var i = 0; i < data.length; i++) {
        blogList.push({
          _id: data[i]._id,
          title: data[i].title,
          author: data[i].author,
          lastedit: data[i].lastedit,
          totalComments: data[i].comments.length
        })
      }
      res.send({error: null,blog: blogList.slice((req.body.page - 1) * blogInPage, req.body.page * blogInPage),
      totalPage: Math.ceil(data.length/blogInPage)});
    }
  });
});

module.exports = router;
