import dotenv from "dotenv";
dotenv.config();
import app from "./server";
import connectDB from "./db";

const HTTP_PORT = parseInt(process.env.HTTP_PORT || "3000", 10);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(HTTP_PORT, () => {
            console.log(`🚀 Server corriendo en: http://localhost:${HTTP_PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
    }
};

startServer();