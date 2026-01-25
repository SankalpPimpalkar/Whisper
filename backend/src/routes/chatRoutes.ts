import { Router } from "express";
import protectRoute from "../middlewares/auth";
import { getChats, getOrCreateChat } from "../controllers/chatController";

const chatRoutes = Router()

chatRoutes.get('/', protectRoute, getChats)
chatRoutes.get('/with/:participantId', protectRoute, getOrCreateChat)

export default chatRoutes