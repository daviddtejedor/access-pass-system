import { z } from "zod";

// ==========================================
// 1. ESTRUCTURAS REUTILIZABLES (Horarios)
// ==========================================

const timeRangeSchema = z.object({
    from: z.number(),
    to: z.number(),
}).refine(
    (range) => range.to > range.from,
    { message: "El horario de fin debe ser mayor al de inicio", path: ["to"] }
);

const scheduleSchema = z.object({
    weekDay: z.number().int().min(0).max(6),
    timeRanges: z.array(timeRangeSchema),
});

// ==========================================
// 2. SCHEMAS DE ZOD (Validación en Runtime)
// ==========================================

// Auth
export const loginSchema = z.object({
    dni: z
        .number({ required_error: "El DNI es obligatorio" })
        .int("El DNI debe ser un número entero")
        .min(10000000, "El DNI debe tener al menos 8 dígitos")
        .max(99999999, "El DNI debe tener máximo 8 dígitos"),
    password: z.string({ required_error: "La contraseña es obligatoria" }),
});

// Users
export const addUserSchema = z.object({
    dni: z
        .number({ required_error: "El DNI es obligatorio" })
        .int("El DNI debe ser un número entero")
        .min(1000000, "El DNI no puede tener menos de 7 dígitos") // Permite DNIs de 7 u 8 dígitos
        .max(99999999, "El DNI no puede tener más de 8 dígitos"),

    name: z.string().min(1, "El nombre no puede estar vacío").max(50),
    password: z.string().min(3, "La contraseña debe tener al menos 3 caracteres"),
    email: z
        .array(z.string().email("Formato de email inválido"))
        .optional()
        .default([])
        .transform((emails) => emails.filter((e) => e.trim() !== "")), // Filtra strings vacíos
    disabled: z.boolean().optional().default(false),
    role: z.enum(["ADMIN", "EMPLOYEE", "PASSANT"]),
    schedule: z.array(scheduleSchema).optional().default([]),
});

// Para actualización hacemos todos los campos opcionales
export const updateUserSchema = addUserSchema.partial();

// Portón
export const portonCommandSchema = z.object({
    command: z.enum(["<abierta>", "<cerrada>"], {
        errorMap: () => ({ message: "Comando no válido. Use '<abierta>' o '<cerrada>'." }),
    }),
});

// ==========================================
// 3. DTOS (Tipos estáticos de TypeScript)
// ==========================================

export type LoginDTO = z.infer<typeof loginSchema>;
export type AddUserDTO = z.infer<typeof addUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type PortonCommandDTO = z.infer<typeof portonCommandSchema>;