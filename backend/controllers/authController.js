import express, { Router } from 'express';
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const authController = Router();

const password = "123456";

authController.post('/register', async (req, res) => {
    try {
    //   const { username, email, password } = req.body;
  
      // Check if the email already exists
      const isExisting = await User.findOne({ email: req.body.email });
      if (isExisting) {
        throw new Error('An account with this email already exists. Please try a different email.');
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);  
  
      // Create the user
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword
      });
  
      const { password, ...others } = newUser._doc;
  
      // Create a JWT token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
  
      return res.status(201).json({ user: others, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
    
authController.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user){
            throw new Error("Invalid credentials")
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if(!comparePass){
            throw new Error("Invalid credentials")
        }

        const {password, ...others} = user._doc
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5h'})        

        return res.status(200).json({user: others, token})
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

export default authController;