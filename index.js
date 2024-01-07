const express = require('express');
const { connection } = require('./db.js');
const { UserRouter } = require('./routes/userPage');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const { UserModel } = require('./models/userModel');

const app = express();


app.use(cors());
app.use(express.json());

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// upload.single('image')

app.post('/api/register',async(req,res)=>{
  const {password} = req.body;
  console.log(password);
  try {

     bcrypt.hash(password,5,async (err,hashed)=>{
        if(hashed){
            try{
              //  const imageBuffer = req.file.buffer;
              //  const imageUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
               const user = {
                 ...req.body,
                 password:hashed,
                //  avatar:imageUrl,
                 created_at:Date(),
                 updated_at:Date() 
               }
               const newUser = new UserModel(user);
          
               await newUser.save();
               res.status(200).json({"Msg":"User account created successfully"})

            }catch(err){
               res.status(400).send({"Error":err});
            }
        }
        else{
            res.status(400).json({"error":err});
        }
     })
    
  } catch (error) {
    res.status(400).json({"error":error});
  }
})


app.post('/api/login',async(req,res)=>{
  console.log(req.body,"body");
  console.log(req.query,"query");
  const {email,password} = req.body;
  try{
      const user = await UserModel.findOne({email});
      if(user){
          bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
              const payload = {
                userID:user._id,
                email:user.email,
                avatar:user.avatar
              }
             const token =  jwt.sign(payload,"Masai",{expiresIn:"1hr"});
             res.status(200).json({"Msg":"Login successful","token":token});
            }
          })
      }
      else{
        res.status(200).json({"Msg":"User not found! Wrong creditionals"});
      }
  }
  catch(err){
    res.status(400).json({"Error":err});
  }
})








app.listen(3000,async()=>{
    try {
        await connection;
        console.log('Database is connected');
        console.log('server is running at port 3000')
    } catch (error) {
        console.log(error);
    }
})