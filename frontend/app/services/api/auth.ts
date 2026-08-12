import { User } from "@/app/types";
import instance from "./config.api";

export const loginRQ = (credentials: any) =>
    instance.post<any, { data: { message: string; user: User; }; }>(`/auth/login`, credentials);

export const logoutRQ = () =>
    instance.post(`/auth/logout`);

export const profileRQ = () =>
    instance.get<any, { data: { message: string; user: User; }; }>(`/auth/profile`);