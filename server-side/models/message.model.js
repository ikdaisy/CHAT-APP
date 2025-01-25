import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    senderId:{type:String},
    receiverId:{type:String},
    message:{type:String},
    time:{type:String},
    date:{type:String},
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    encryptionKey: { type: String, required: true },  // Store encryption key (hex format)
    encryptionIv: { type: String, required: true }    // Store initialization vector (hex format)

})

export default mongoose.model.Messages || mongoose.model("Message",messageSchema);