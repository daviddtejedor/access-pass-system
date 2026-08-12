import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.routes";
import mqtt from "mqtt";
import { globalErrorHandler } from "@middlewares/error.middleware";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// CONFIGURACIÓN DE CORS 
// Leemos la variable o usamos el fallback por defecto
const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3001'];

// Permitimos también llamadas entre entornos de desarrollo locales si fuera necesario
const allowedOrigins = [
  ...envOrigins,
  'http://localhost:3000' // Opcional: útil si usás Server-Side Rendering o endpoints locales
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin 'origin' (Postman, cURL, Thunder Client) o si está en la lista blanca
    if (!origin || allowedOrigins.includes(origin))
      callback(null, true);
    else
      callback(new Error(`Origen ${origin} no permitido por CORS`));
  },
  credentials: true, // Requerido para transferir las cookies HttpOnly
}));

app.get("/", (_, res) => { res.send("Server funcionando!"); });

app.use("/", router);

// PARTE DE MQTT 
let isConnected = false;

// Si process.env.MQTT_URI no existe o está vacío, usa "mqtt://localhost:1883"
const mqttBrokerUrl = process.env.MQTT_URI || "mqtt://localhost:1883";

const client = mqtt.connect(mqttBrokerUrl, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: process.env.MQTT_CLIENT_ID || `express_${Math.random().toString(16).slice(2, 8)}`
});

client.on("connect", () => {
  if (isConnected) return; // Prevenir múltiples suscripciones

  isConnected = true;
  const topic = "Porton/35933f";

  client.subscribe(topic, (err) => {
    if (!err)
      console.log(`✅ Subscribed to topic: ${topic}`);
    else
      console.error(`❌ Failed to subscribe to topic: ${topic}`, err);
  });
});

client.on("message", (topic, message) => {
  const order = message.toString();

  if (topic === "Porton/35933f") {
    if (order === "<cerrada>") {
      console.log("El portón está cerrado. Enviando orden para abrir el portón...");

      client.publish("Porton/35933f", "<abierta>", {}, (err) => {
        if (err)
          console.error("Error al publicar: <abierta>", err);
        else
          console.log("Comando <abierta> publicado exitosamente.");
      });
    }
    else if (order === "<abierta>") {
      console.log("El portón está abierto. No se realizará nada.");
    }
    else
      console.log("Orden desconocida:", order);
  }
  else
    console.log("Subscripción Desconocida:", topic);
});

app.use(globalErrorHandler);

export { client as MqttClient };
export default app;