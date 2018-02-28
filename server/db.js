const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myblog');


const db = mongoose.connection;
db.once('error',() => console.log('Mongo connection error'));
db.once('open',() => console.log('Mongo connection successed'));


const userSchema = mongoose.Schema({
  username : String,
  id : String,
  password : String,
  email : String,
  phone : String,
  signed : Boolean,
  signTime : String
});

const blogSchema = mongoose.Schema({
  hide : Boolean,
  title : String,
  content : String,
  author : String,
  lastedit : String,
  comments : Array,
  totalComment : Number
});


const Models = {
    User : mongoose.model('User', userSchema),
    Blog : mongoose.model('Blog', blogSchema)
}

module.exports = Models;
