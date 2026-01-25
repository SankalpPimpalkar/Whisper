import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import Chat from "../models/Chat";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        const chats = await Chat.find({ participants: userId })
            .populate("participants", "name email avatar")
            .populate("lastMessage")
            .sort({ lastMessageAt: -1 })

        const formattedChats = chats.map(chat => {
            const otherParticipants = chat.participants.filter(p => p._id.toString() !== userId)
            return {
                _id: chat._id,
                participants: otherParticipants,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt
            }
        })

        return res
            .status(200)
            .json(formattedChats)

    } catch (error) {
        res.status(500)
        next(error)
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId
        const { participantId } = req.params

        let chat = await Chat.findOne({ participants: { $all: [userId, participantId] } })
            .populate("participants", "name email avatar")
            .populate("lastMessage")

        if (!chat) {
            chat = new Chat({ participants: [userId, participantId] })
            await chat.save()
            chat = await chat.populate("participants", "name email avatar")
        }

        const otherParticipant = chat.participants.filter(p => p._id.toString() !== userId)

        return res
            .status(200)
            .json({
                _id: chat._id,
                participant: otherParticipant,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt
            })

    } catch (error) {
        res.status(500)
        next(error)
    }
}