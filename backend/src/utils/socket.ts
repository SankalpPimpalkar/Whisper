import { Socket, Server as SocketServer } from "socket.io";
import { Server as httpServer } from "http"
import { verifyToken } from "@clerk/express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import User from "../models/User";

interface CustomSocket extends Socket {
    userId: string
}

export const onlineUsers: Map<string, string> = new Map()

const initializeSocketServer = (httpServer: httpServer) => {
    const ALLOWED_ORIGINS = [
        'http://localhost:8081',
        'http://localhost:5173',
        process.env.FRONTEND_URL!
    ]

    const io = new SocketServer(httpServer, { cors: { origin: ALLOWED_ORIGINS } })

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication Error"))
        }

        try {
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
            const clerkId = session.sub

            const user = await User.findOne({ clerkId })
            if (!user) {
                return next(new Error("User not Found"))
            }

            (socket as CustomSocket).userId = user._id.toString()
            next()

        } catch (error: any) {
            next(new Error(error))
        }
    })

    io.on("connection", (socket) => {
        const userId = (socket as CustomSocket).userId
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) })

        onlineUsers.set(userId, socket.id)
        socket.broadcast.emit('user-online', { userId })

        socket.join(`user:${userId}`)

        socket.on('join-chat', (chatId: string) => {
            socket.join(`chat:${chatId}`)
        })

        socket.on('leave-chat', (chatId: string) => {
            socket.leave(`chat:${chatId}`)
        })

        socket.on('send-message', async (data: { chatId: string, text: string }) => {
            try {
                const { chatId, text } = data

                const chat = await Chat.findOne({ _id: chatId, participants: userId })

                if (!chat) {
                    socket.emit('socket-error', { message: "Chat not Found" })
                    return
                }

                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text
                })

                chat.lastMessage = message._id
                chat.lastMessageAt = new Date()
                await chat.save()

                await chat.populate("sender", "name email avatar")

                io.to(`chat:${chatId}`).emit("new-message", message)

                for (const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit("new-message", message)

                }

            } catch (error) {
                socket.emit('socket-error', { message: "Failed to send message" })
            }
        })

        socket.on('typing', async (data) => { })

        socket.on('disconnect', () => {
            onlineUsers.delete(userId)
            socket.broadcast.emit('user-offline', { userId })
        })
    })

    return io
}

export default initializeSocketServer