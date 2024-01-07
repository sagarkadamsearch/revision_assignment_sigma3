const express = require('express');
const {UserModel} = require('../models/userModel');


const UserRouter = express.Router();



UserRouter.get('/',(req,res)=>{
   res.send('Hello from server 8080');
})





module.exports = {UserRouter};