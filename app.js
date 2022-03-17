//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const aboutContent = "A simple blog using ejs & mongoDB.";
const contactContent = "Welcome to contact me and check my personal website";

mongoose.connect('mongodb+srv://admin-Mushroom:todolist123@cluster0.kkhmb.mongodb.net/blogDB', {useNewUrlParser:true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title:String,
  content: String
}

const Post = mongoose.model('Post', postSchema);




app.get("/", function(req, res){
  Post.find({}, (err, foundpost) =>{
    if (!err) {
      res.render("home", {

        posts: foundpost
        });
    }
  })

});

app.post('/edit',(req,res) =>{
  const editedId = req.body.edit;
  Post.findOne({_id:editedId},(err,foundpost) =>{
    if(!err) res.render("edit", {title: foundpost.title, content:foundpost.content,id:foundpost._id});
  })

})

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
  // post.save((err) =>{
  //     if (!err)res.redirect("/posts");
  //   });

  Post.findOne({_id:req.body.editedId},(err,foundpost) =>{
    if(!err){
      if(!foundpost){

        post.save((err) =>{
          if (!err)res.redirect("/posts");
        });
      } else{
        Post.findOneAndUpdate({_id:req.body.editedId}, {$set: {title:req.body.postTitle,content: req.body.postBody}},(err)=>{
          if(!err) res.redirect("posts");
        });
      }
    }
  })

});

app.get('/posts',(req,res) => {

  Post.find({},(err, foundposts) =>{
    if(!err){
      res.render("posts", {
        posts: foundposts
        });
    }
  });
});


app.get("/posts/:postId", function(req, res){
  const requestedId = (req.params.postId)
  Post.findOne({_id: requestedId},  (err,foundpost) => {
    if(!err) {
      res.render("post", {
        title: foundpost.title,
        content: foundpost.content,
        id: foundpost._id
      });
    }
  })
});


app.post('/delete', function(req,res){
  const deletePostId = req.body.delete;
  Post.findByIdAndRemove({_id:deletePostId}, (err)=>{
    if(!err) res.redirect('/')
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
