import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("MONGODB Connected!!")

    } catch (error) {
        console.log("Error Occurred while connecting DB", error)
        process.exit(1)
    }
}