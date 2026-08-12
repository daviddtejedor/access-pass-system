"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginRQ, logoutRQ, profileRQ } from '../services/api/auth';
import { ReactNode } from "react";
import { User } from "@/app/types";

interface AuthContextType {
    signin: (credentials: any) => Promise<User | null>;
    signout: () => Promise<void>;
    isAuthenticated: boolean;
    errors: string[];
    user: User | null;
    loading: boolean;
    checkAuth: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
export default useAuth;

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    //Impide que los componentes (como ProtectedLayout) intenten mostrar contenido o redirigir 
    // al usuario antes de que la aplicación sepa si el usuario está realmente autenticado o no.
    const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

    // Limpia los errores después de un tiempo
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000); // Borra los errores después de 5 segundos
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // Función para iniciar sesión
    const signin = useCallback(async (credentials: any): Promise<User | null> => {
        setErrors([]);
        try {
            const res = await loginRQ(credentials);
            const { user: userData } = res.data; // Backend envía el token en cookie HTTP-only, solo desestructuramos 'user'

            if (userData) {
                setUser(userData as User);
                setIsAuthenticated(true);
                return userData as User;
            }
            setErrors(["La respuesta de inicio de sesión no contenía datos de usuario."]);
            return null;
        } catch (error: any) {
            console.error("Error durante sign-in:", error);
            setErrors([error.response?.data?.message || "Error desconocido al iniciar sesión."]);
            setUser(null);
            setIsAuthenticated(false);
            return null;
        }
    }, []);
    //Función para cerrar sesión
    const signout = async () => {
        setErrors([]);
        try {
            await logoutRQ(); // Tu API debería invalidar el token en el backend
            setUser(null);
            setIsAuthenticated(false);
        } catch (error: any) {
            console.error("Error during signout:", error);
            setErrors([error.response?.data?.message || "Error during signout."]);
        }
    };

    // Función para verificar el estado de autenticación inicial
    const checkAuth = useCallback(async () => {
        setIsAuthChecking(true);
        setErrors([]);
        try {
            const res = await profileRQ();

            if (res.data && res.data.user) {
                setUser(res.data.user as User);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err: any) {
            // 💡 Usamos log/info en vez de error para que Next.js no muestre el Overlay de desarrollo
            console.log("No hay sesión activa activa:", err.response?.status || err.message);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsAuthChecking(false);
        }
    }, []);

    // Este useEffect se ejecuta una vez al montar para verificar la sesión inicial
    useEffect(() => {
        checkAuth();
    }, []); // Dependencia vacía para que se ejecute solo al montar

    const value = {
        signin,
        signout,
        errors,
        user,
        isAuthenticated,
        loading: isAuthChecking,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};