import mongoose, { type Document } from "mongoose";

export interface IMessage extends Document {
    chat: mongoose.Types.ObjectId
    sender: mongoose.Types.ObjectId
    text: string
    createdAt: Date
    updatedAt: Date
}

const messageSchema = new mongoose.Schema<IMessage>({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

messageSchema.index({ chat: 1, createdAt: 1 })

const Message = mongoose.model('Message', messageSchema)
export default Message