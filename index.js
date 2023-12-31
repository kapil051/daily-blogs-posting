import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import bodyParser from "body-parser";

   const port=3000;
   const app=express();

   app.use(express.urlencoded({ extended: true }));
   app.use(express.static("public"));

        // const mongoDBURI = 'mongodb://0.0.0.0:27017/blogs';
        // mongoose.connect(mongoDBURI);

        // mongoose.connection.on('connected', () => {
        //   console.log('Mongoose connected to MongoDB');
        // });

        const dbURL="mongodb+srv://new_user:4dXTZbvSxjwHgwjT@cluster0.kdwvilt.mongodb.net/REMOTEDB";

        const connectionParams={
           useNewUrlParser:true,
            useUnifiedTopology:true,
        }
       
        mongoose.connect(dbURL,connectionParams).then(()=>{
             console.info("connected to the db!");
        }).catch((e)=>{
           console.log("error:",e);
        })
       
        //blog-schema

        const blogSchema = new mongoose.Schema({
          title: {
            type: String,
            required: true,
          },
          post: {
            type: String,
            required: true,
          },
        });

     const Blog = mongoose.model('Blog', blogSchema);

     //password schema

     const userSchema = new mongoose.Schema({

       username: {
         type: String,
         required: true,
         unique: true,
       },
       email: {
         type: String,
         required: true,
         unique: true,
         match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
       },
       password: {
         type: String,
         required: true,
       },

     });
     
     const User = mongoose.model('User', userSchema);


      app.get("/",(req,res)=>{
            res.render("first.ejs");
      })

     app.get("/signup",(req,res)=>{
       res.render("signup.ejs");
     })

     app.get("/signin",(req,res)=>{
        res.render("signin.ejs");
     })

     app.post("/signup",(req,res)=>{

        let newUsername=req.body.username;
        let newEmail=req.body.email;
        let newPassword=req.body.password;

        const newUser = new User({
          username: newUsername ,
          email: newEmail,
          password: newPassword,
        });

           newUser.save();

           res.redirect("/home");

     })

     app.post("/signin",(req,res)=>{

      
     })

 

    app.get("/home",async(req,res)=>{
     try {
          const blogs = await Blog.find(); 
          res.render('home.ejs', { blogs }); 
        } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
    })


    app.get("/compose",(req,res)=>{
         res.render("compose.ejs",{});
    })

    app.get("/about",(req,res)=>{
        res.render("about.ejs",{});
    })

    app.get("/contact",(req,res)=>{
         res.render("contact.ejs",{});
    })

      app.post("/add",(req,res)=>{

          const newBlogPost = new Blog({
               title: req.body.title,
               post: req.body.post,
             });

                newBlogPost.save();

                res.redirect("/home");

      })


      app.post("/delete-blog",async(req,res)=>{

         const blogId=req.body.blogId; 
           
         try {
          const deletedBlog = await Blog.findByIdAndRemove(blogId);
      
          if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
          }

             else{
              res.redirect("/home");
             }

        } catch (error) {
          console.error('Error deleting blog:', error);
          res.status(500).json({ message: 'Internal server error' });
        }

      })
    

   app.listen(port,()=>{
        console.log(`server is up and running at port ${port}`);
   })

 

