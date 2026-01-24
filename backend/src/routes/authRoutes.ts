import { Router } from "express";
import protectRoute from "../middlewares/auth";
import { authCallback, getMe } from "../controllers/authController";

const authRoutes = Router()

authRoutes.get('/me', protectRoute, getMe)
authRoutes.get('/callback', authCallback)

export default authRoutes