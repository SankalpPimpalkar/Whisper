import type { NextFunction, Request, Response } from "express";


export default function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    console.log("Error Occured", err.message)
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500

    return res
        .status(statusCode)
        .json({
            message: err.message || "Internal Server Error",
            ...(process.env.NODE_ENV === "dev" && { stack: err.stack })
        })
}