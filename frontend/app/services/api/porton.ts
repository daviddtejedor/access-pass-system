import instance from "./config.api";

export const controlRQ = (command: string) => instance.post(`porton/control`, { command });

