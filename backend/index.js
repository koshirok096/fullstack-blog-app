import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import authController from './controllers/authController.js';
import blogController from './controllers/blogController.js';

import bodyParser from 'body-parser';
import multer from 'multer';


const app = express(); // initialize express
dotenv.config(); // initialize dotenv
app.use(cors())
app.use(bodyParser.json());
app.use(express.static('public'))


// no need to use for ESM //
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

// connect db 
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB has been started successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// routes
app.use('/auth', authController)
app.use('/blog', blogController)

// multer
const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, 'public/images')
  },
  filename: function(req, file, cb){
      cb(null, req.body.filename)
  }
})

const upload = multer({
  storage: storage
})

app.post('/upload', upload.single("image"), async(req, res) => {
  return res.status(200).json({msg: "Successfully uploaded"})
})


// connect server
app.listen(process.env.PORT, () =>  {
    console.log("Server has been connected succesfully");
  });
