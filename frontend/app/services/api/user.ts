import { User, CreateUserPayload, PaginationInfo } from "@/app/types";
import instance from "./config.api";


export const getUsersRQ = () => instance.get<any, { data: { message: string; user: User[]; pagination?: PaginationInfo; }; }>(`user/`);

export const getFilterUsersRQ = (role: string, disabled: string, page: number = 1, limit: number = 5) =>
  instance.get<any, { data: { message: string; user: User[]; pagination?: PaginationInfo; }; }>(`user/filter`, {
    params: { role, disabled, page, limit }
  });

export const getUserByIdRQ = (dni: string) => instance.get<any, { data: { message: string; user: User; }; }>(`user/${dni}`);

export const postUserRQ = (user: CreateUserPayload) => instance.post<any, { data: { message: string; user: User; }; }>(`user/`, user);

export const putUserRQ = (dni: string, user: Partial<CreateUserPayload>) => instance.put<any, { data: { message: string; user: User; }; }>(`user/${dni}`, user);

export const deleteUserRQ = (dni: string) => instance.delete<any, { data: { message: string; user: User; }; }>(`user/${dni}`);