const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const homestartcontent="Welcome to our Blogosphere website: Write your own blogs and access it from anywhere anytime! ";
const aboutcontent= "Our blog isn't just about information - it's about fostering a community of curious minds. We encourage open dialogue, so feel free to join the conversation by leaving comments and sharing your thoughts. Whether you're here to learn, connect, or simply unwind, we're here to accompany you every step of the way.At the heart of it all, our mission is to create a digital space where knowledge meets creativity. We believe that the intersection of ideas is where innovation thrives, and that's exactly what we strive to cultivate here. Thank you for being a part of our journey. Together, let's explore, learn, and grow. ";
const contactcontent="Get in Touch!.We'd love to hear from you! Whether you have questions, feedback, collaboration ideas, or just want to say hello, this is the place to do it. Fill out the contact form below or reach out to us directly via email or social media. We're excited to connect with our readers and value your input.";
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;


mongoose
  .connect("mongodb://127.0.0.1:27017/blogdb", {       /* DATABASE CONNECTION CODE*/ 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("database connected");
  })
  .catch(err => {
    console.log("Could not connect", err);
  });
  const postSchema = new mongoose.Schema({                  /*SCHEMA DECLARATION */
   title: String,
   content: String
  });
  const Post = mongoose.model("Post", postSchema);     /*MODEL DECLARATION*/
 
let posts=[];
async function getPosts(){

    const posts = await Post.find({});
    return posts;
  
  }
async function getPost(){

    const post= await Post.findOne({});
    return post;
  
  }
app.get("/",function(req,res){
    getPosts().then(function(FoundPosts){
    
        res.render("home", {content1: homestartcontent,
            posts:FoundPosts});
    
      });
    
      
    
                                                      /* rendering home page */
});
app.get("/about",function(req,res){
    res.render("about",{content2: aboutcontent});                     /* rendering about page */
});
app.get("/contact",function(req,res){
    res.render("contact",{content3: contactcontent});                     /* rendering contact page */
});
app.get("/compose",function(req,res){
    
    res.render("compose");                                                 /* rendering compose page */
});
app.post("/compose",function(req,res){
    const post = new Post ({
        
        title:req.body.postTitle,
        content:req.body.postBody
      });
    post.save();
    res.redirect("/");
        
    }); 
     
    

app.get("/posts/:postId",function(req,res){                        /*express routing parameter */
    const requestedId = req.params.postId;
   Post.findOne({_id:requestedId}).then((post) => {
    res.render("post",{
        title:post.title,
        content:post.content
    });
   });

    
});



app.listen(3000,function(){
    console.log("server is started in port 3000");

});