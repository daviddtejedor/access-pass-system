"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ReactNode } from "react";
import { controlRQ } from "../services/api/porton";

interface PortonContextType {
  control: (command: string) => Promise<void>;
  errors: string[];
  isLoading: boolean;
}

export const PortonContext = createContext<PortonContextType | undefined>(undefined);

const usePorton = () => {
  const context = useContext(PortonContext);
  if (!context) throw new Error("usePorton must be used within a PortonProvider");
  return context;
};

export default usePorton;

export const PortonProvider = ({ children }: { children: ReactNode; }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Limpia los errores después de un tiempo
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => { setErrors([]); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const control = useCallback(async (command: string) => {
    setErrors([]);
    setIsLoading(true);
    try {
      await controlRQ(command);
      console.log(`Comando ${command} enviado exitosamente`);
    } catch (error: any) {
      console.error("Error al controlar el portón:", error);
      setErrors([error.response?.data?.message || "Error desconocido al controlar el portón."]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = { control, errors, isLoading };

  return (
    <PortonContext.Provider value={value}>
      {children}
    </PortonContext.Provider>
  );
};
