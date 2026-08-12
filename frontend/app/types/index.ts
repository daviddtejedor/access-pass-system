import { FieldValues, UseFormRegister } from "react-hook-form";

// Interfaz User: lo que se RECIBE del backend 
export interface User {
  _id: string;
  dni: number;
  name: string;
  email?: string[];
  schedule: Array<{
    weekDay: number;
    timeRanges: Array<{ from: number | null; to: number | null; }>;
  }>;
  role: string;
  disabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
}
// Interfaz CreateUserPayload: lo que se ENVÍA al backend para CREAR un User 
export interface CreateUserPayload {
  dni: number;
  name: string;
  email?: string[];
  password: string;
  role: "EMPLOYEE" | "ADMIN" | "PASSANT";
  schedule: Array<{
    weekDay: number;
    timeRanges: Array<{ from: number | null; to: number | null; }>;
  }>;
}
// Roles existentes
export const RoleMap: Record<string, string> = {
  ADMIN: "Administrador",
  EMPLOYEE: "Empleado",
  PASSANT: "Pasante",
};
export interface Horario {
  _id?: string;
  tempId?: string;
  from: number | null;
  to: number | null;
};
export interface DiaHorario {
  weekDay: number;
  timeRanges: Horario[];
};
// Paginación
export interface PaginationInfo {
  currentPage: number;
  limit: number; // El límite, aunque sea fijo, viene en la respuesta del backend
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserDataFormProps {
  register: UseFormRegister<FieldValues>;
  isEditing: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}