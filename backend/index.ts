import app from "./src/app";
import connectDB from "./src/config/database";
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is listening at ", PORT)
    })
}).catch((err) => {
    console.log("Failed to Start Server", err)
    process.exit(1)
})