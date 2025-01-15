import userSchema from './models/user.model.js'
import chatMemberSchema from './models/chatmember.model.js'
import messageSchema from './models/message.model.js'

import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const {sign}= jwt

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: "safakallianthodi6@gmail.com",
      pass: "fbtw wgph qsuv ngvk",
    },
  });

export async function signUp(req,res){
    const {username,email,password,cpassword,phone,profile}=req.body
    if(!(username&&email&&password&&cpassword&&phone&&profile))
        return res.status(400).send({msg:"Fields are empty"})
    const userEmail=await userSchema.findOne({email})
    if(userEmail){
        return res.status(400).send({msg:"Email already exists"})
    }
    if(password!=cpassword){
        return res.status(400).send({msg:"Passwords are not matching"})
    }
    bcrypt.hash(password,10).then(async(hashedPassword)=>{
        await userSchema.create({username,email,password:hashedPassword,profile,phone}).then(()=>{
        return res.status(201).send({msg:"Successfully registered"})
        }).catch((error)=>{
        return res.status(400).send(error)
        })
    })  
}

export async function signIn(req,res){
   try {
    const {email,password}=req.body
    if(!(email&&password))
        return res.status(400).send({msg:"Fields are empty"})
    const user=await userSchema.findOne({email})
    if(!user){
        return res.status(400).send({msg:"User doesnt exist"})
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res.status(400).send({msg:"Invalid password"})
    }
    const token = await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"})
    res.status(200).send({msg:"Successfully logged in",token})
   } catch (error) {
        return res.status(400).send(error) 
   }  
}

export async function checkEmail(req, res) {
    try {
        const { email, type } = req.body; // Expecting 'type' to be either 'signup' or 'forgot-password'

        let subject, htmlContent, buttonText, buttonUrl;

        // Logic to handle different email types
        if (type === 'signup') {
            subject = "EMAIL VERIFICATION";
            buttonText = "Verify Your Account";
            buttonUrl = "http://localhost:5173/signup";
            htmlContent = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                            color: #333;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            border: 1px solid #ddd;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                        }
                        .btn {
                            display: inline-block;
                            background-color: #000000;
                            color: #ffffff;
                            text-decoration: none;
                            padding: 15px 30px;
                            margin-top: 20px;
                            border-radius: 4px;
                            font-size: 18px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <p>Hello,</p>
                        <p>Please verify your email address by clicking the button below.</p>
                        <a href="${buttonUrl}" class="btn">${buttonText}</a>
                    </div>
                </body>
                </html>
            `;
        } else if (type === 'forgot-password') {
            subject = "RESET PASSWORD";
            buttonText = "Reset Your Password";
            buttonUrl = "http://localhost:5173/confirmpassword"; // You may want to replace this with a dynamic reset link
            htmlContent = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                            color: #333;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            border: 1px solid #ddd;
                            padding: 20px;
                            border-radius: 8px;
                            text-align: center;
                        }
                        .btn {
                            display: inline-block;
                            background-color: #000000;
                            color: #ffffff;
                            text-decoration: none;
                            padding: 15px 30px;
                            margin-top: 20px;
                            border-radius: 4px;
                            font-size: 18px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <p>Hello,</p>
                        <p>If you requested a password reset, please click the button below to reset your password.</p>
                        <a href="${buttonUrl}" class="btn">${buttonText}</a>
                    </div>
                </body>
                </html>
            `;
        } else {
            return res.status(400).send({ msg: "Invalid request type" });
        }

        // Send the email using the transporter
        const info = await transporter.sendMail({
            from: 'safakallianthodi6@gmail.com',
            to: email, // list of receivers
            subject: subject,
            text: "Please verify your action.",
            html: htmlContent, // html body
        });

        res.status(200).send({ msg: `${type.charAt(0).toUpperCase() + type.slice(1)} email sent successfully` });

    } catch (error) {
        return res.status(400).send(error);
    }
}


export async function changePassword(req,res) {

    const {password,email}=req.body
    //update the new password (hash before updating)
    bcrypt.hash(password,10).then((hashedPassword)=>{
        userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
               res.status(200).send({msg:"Your password has been succesfully updated"})
             }).catch((error)=>{
                console.log(error);
             })
    })

}

export async function getUser(req,res) {
    try {
        const id=req.user
        const{_id}=req.params
        const receivers=await chatMemberSchema.find({senderId:id});
        console.log(receivers);
        
        const chatMemberPromises = receivers.map(async (receiver) => {
            if(receiver.senderId==id)
                return await userSchema.findOne({ _id: receiver.receiverId },{username:1,profile:1});
            // if(receiver.receiverId==id)
            //     return await userSchema.findOne({ _id: receiver.senderId },{username:1,profile:1});
        });
        const chatMembers = await Promise.all(chatMemberPromises);

        const user= await userSchema.findOne({_id:id})
        
        // console.log(user);
        return res.status(200).send({user,chatMembers})
    } catch (error) {
        return res.status(404).send(error)

        
    }
    
}



export async function getReceiver(req,res) {
    try {
        const id=req.user
        const{_id}=req.params
        const user= await userSchema.findOne({_id:id})
        const ruser=await userSchema.findOne({_id})
        // console.log(user);
        return res.status(200).send({ruser,username:user.username})
    } catch (error) {
        return res.status(404).send(error)

        
    }
    
}

export async function editUser(req,res) {
    const _id=req.user 
    const {username,email,phone}=req.body
    await userSchema.updateOne({_id},{$set:{username,email,phone}}).then(()=>{
        res.status(201).send({msg:"Successfully Updated"})
    }).catch ((error)=>{
        return res.status(404).send(error)

    })
    
}

export async function getContacts(req,res) {
    try {
        const _id=req.user
        const user=await userSchema.findOne({_id})
        const contacts= await userSchema.find({_id:{$ne:_id}})
        // console.log(contacts);
        return res.status(200).send({contacts,username:user.username})
    } catch (error) {
        return res.status(404).send(error)

        
    }
    
}

export async function getContact(req,res) {
    try {
        const sid=req.user
        const {rid}=req.params
        const receiver=await userSchema.findOne({_id:rid},{profile:1,username:1})
        const sender=await userSchema.findOne({_id:sid},{profile:1,username:1})

        // console.log(receiver);
        
        const chats=await messageSchema.find({$or:[{senderId:sid,receiverId:rid},{senderId:rid,receiverId:sid}]});
        // console.log(contacts);
        return res.status(200).send({receiver,chats,uid:sid,sender})
    } catch (error) {
        console.log(error);
        
        return res.status(404).send(error)

        
    }
    
}

export async function addMessage(req,res) {
    try {
        const {rid}=req.params;
        const sid=req.user;
        const {message,date,time}=req.body;
        const chatmember=await chatMemberSchema.findOne({senderId:sid,receiverId:rid});
        if(!chatmember)
           await chatMemberSchema.create({senderId:sid,receiverId:rid})
        const chats=await messageSchema.create({senderId:sid,receiverId:rid,message,date,time});
        return res.status(201).send({msg:"success"});
    } catch (error) {
        console.log(error);
        
        return res.status(404).send({msg:"error"})
    }
}

export async function deleteMessage(req,res) {
    try {
        const {_id}=req.params;
        const senderId=req.user;
        const msg=await messageSchema.findOne({_id,senderId});
        
        if(!msg)
           return res.status(404).send({msg:"Cannot delete others message"});
        const deletemessage=await messageSchema.deleteOne({$and:[{_id},{senderId}]})
        return res.status(201).send({msg:"Success"});
    } catch (error) {
        return res.status(404).send({msg:"Error"})
    }
}
