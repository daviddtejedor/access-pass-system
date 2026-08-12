// src/services/porton.service.ts
import { MqttClient } from "../server";
import { AppError } from "../libs/AppError";

export class PortonService {
    private static readonly TOPIC = "Porton/35933f";
    private static readonly VALID_COMMANDS = ["<abierta>", "<cerrada>"];

    static async sendGateCommand(command: string): Promise<string> {
        // 1. Validamos la regla de negocio/comando
        if (!command || !this.VALID_COMMANDS.includes(command))
            throw new AppError("Comando no válido. Use '<abierta>' o '<cerrada>'.", 400);

        // 2. Encapsulamos el callback del broker MQTT en una Promesa
        return new Promise((resolve, reject) => {
            MqttClient.publish(this.TOPIC, command, {}, (err) => {
                if (err) {
                    console.error(`Error al publicar ${command} en MQTT:`, err);
                    return reject(new AppError("Error al enviar el comando MQTT", 500));
                }

                resolve(`Comando ${command} enviado correctamente.`);
            });
        });
    }
}