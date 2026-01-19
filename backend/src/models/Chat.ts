import mongoose, { type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[]
    lastMessage: mongoose.Types.ObjectId
    lastMessageAt: Date
    createdAt: Date
    updatedAt: Date
}

const chatSchema = new mongoose.Schema<IChat>({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    lastMessageAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true })

const Chat = mongoose.model('Chat', chatSchema)
export default Chat