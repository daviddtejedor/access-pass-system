// 1. dotenv SIEMPRE en la primera línea
import dotenv from "dotenv";
dotenv.config();

// 2. Después importamos los módulos que leen process.env
import app from "./server";
import connectDB from "./db";

// 3. Fallback seguro: lee PORT o HTTP_PORT, si no existen usa 3000
const HTTP_PORT = parseInt(process.env.PORT || process.env.HTTP_PORT || "3000", 10);

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