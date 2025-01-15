import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String},
    profile:{type:String},
    phone:{type:String},
    email:{type:String},
    password:{type:String},
    cpassword:{type:String},
})

export default mongoose.model.users || mongoose.model("user",userSchema);