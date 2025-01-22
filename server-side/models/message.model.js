import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    senderId:{type:String},
    receiverId:{type:String},
    message:{type:String},
    time:{type:String},
    date:{type:String},
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }

})

export default mongoose.model.Messages || mongoose.model("Message",messageSchema);