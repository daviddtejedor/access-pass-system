"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { postUserRQ, deleteUserRQ, getUserByIdRQ, putUserRQ, getFilterUsersRQ } from '../services/api/user';
import { ReactNode } from "react";
import { User, CreateUserPayload, PaginationInfo } from "@/app/types";

interface UserContextType {
    getFilterUsers: (role: string, disabled: string, page?: number, limit?: number) => Promise<{ users: User[], pagination: PaginationInfo; }>;
    getUserById: (id: string) => Promise<User>;
    addUser: (user: CreateUserPayload) => Promise<void>;
    updateUser: (id: string, user: CreateUserPayload) => Promise<User>;
    deleteUser: (id: string) => Promise<void>;
    errors: string[];
    userTable: User[] | null;
    pagination: any;
    setPagination: (pagination: any) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
export default useUser;

export const UserProvider = ({ children }: { children: ReactNode; }) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [userTable, setUserTable] = useState<User[] | null>(null);
    const [pagination, setPagination] = useState<any>(null);

    // Limpia los errores después de un tiempo
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => { setErrors([]); }, 5000); // Borra los errores después de 5 segundos
            return () => clearTimeout(timer);
        }
    }, [errors]);


    const getFilterUsers = useCallback(async (role: string, disabled: string, page: number = 1): Promise<{ users: User[], pagination: any; }> => {
        setErrors([]);
        try {
            const res = await getFilterUsersRQ(role, disabled, page);
            setUserTable(res.data.user);
            setPagination(res.data.pagination);
            return { users: res.data.user || [], pagination: res.data.pagination };
        } catch (error: any) {
            console.error("Error al obtener usuarios en UserContext:", error);
            setErrors([error.response?.data?.message || "Error desconocido al obtener usuarios."]);
            return { users: [], pagination: null };
        }
    }, []);

    const getUserById = useCallback(async (id: string): Promise<User> => {
        setErrors([]);
        try {
            const res = await getUserByIdRQ(id);
            return res.data.user;
        } catch (error: any) {
            console.error("Error al obtener usuario en UserContext:", error);
            setErrors([error.response?.data?.message || "Error desconocido al obtener usuario."]);
            throw error; // Re-lanzar el error para que pueda ser manejado más arriba
        }
    }, []);

    const addUser = useCallback(async (userData: CreateUserPayload) => {
        setErrors([]);
        try {
            await postUserRQ(userData);
        } catch (error: any) {
            console.error("Error adding user:", error);
            setErrors([error.response?.data?.message || "Error adding user."]);
        }
    }, []);

    const updateUser = useCallback(async (id: string, user: CreateUserPayload): Promise<User> => {
        setErrors([]);
        try {
            const res = await putUserRQ(id, user);
            return res.data.user;
        } catch (error: any) {
            console.error("Error al actualizar usuario en UserContext:", error);
            setErrors([error.response?.data?.message || "Error desconocido al actualizar usuario."]);
            throw error;
        }
    }, []);

    const deleteUser = useCallback(async (id: string): Promise<void> => {
        setErrors([]);
        try {
            await deleteUserRQ(id);
        } catch (error: any) {
            console.error("Error al eliminar usuario en UserContext:", error);
            setErrors([error.response?.data?.message || "Error desconocido al eliminar usuario."]);
        }
    }, []);


    const value = { getFilterUsers, getUserById, addUser, updateUser, deleteUser, errors, userTable, pagination, setPagination };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};