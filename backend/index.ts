import app from "./src/app";
import connectDB from "./src/config/database";
import { createServer } from "http"
import initializeSocketServer from "./src/utils/socket";

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app)

initializeSocketServer(httpServer)

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log("Server is listening at ", PORT)
    })
}).catch((err) => {
    console.log("Failed to Start Server", err)
    process.exit(1)
})