import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import User from "../models/User";
import { requireAuth } from "@clerk/express";

export type AuthRequest = Request & {
    userId?: string
}

const protectRoute = [
    requireAuth(),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userId: clerkId } = getAuth(req)

            if (!clerkId) {
                return res
                    .status(401)
                    .json({ message: "Unauthorized Request" })
            }

            const user = await User.findOne({ clerkId })

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "User not Found" })
            }

            req.userId = user._id.toString()
            next()

        } catch (error) {
            console.log("Error in Protect Route", error)
            return res
                .status(500)
                .json({ message: "Internal Server Error " })
        }
    }
]

export default protectRoute