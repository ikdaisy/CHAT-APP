import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    senderId:{type:String},
    receiverId:{type:String},
    message:{type:String},
    time:{type:String},
    date:{type:String}
})

export default mongoose.model.Messages || mongoose.model("Message",messageSchema);