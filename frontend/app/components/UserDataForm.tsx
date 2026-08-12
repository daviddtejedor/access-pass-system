import React from 'react';
import { UserDataFormProps } from "@/app/types/index";
import Inputs from "./Inputs";
import SelectInput from "./SelectInput";
import PasswordInput from "./PasswordInput";

export default function UserDataForm({ register, isEditing, showPassword, setShowPassword, }: UserDataFormProps) {

  const roleOptions = [
    { value: "ADMIN", label: "Administrador" },
    { value: "EMPLOYEE", label: "Empleado" },
    { value: "PASSANT", label: "Pasante" }
  ];

  return (
    <div className="grid md:grid-cols-3  grid-cols-1 gap-x-4 md:gap-y-2 gap-y-4">
      <Inputs type="number" name="dni" label="DNI" required={true} register={register} isEditing={isEditing}
        validation={{
          min: { value: 10000000, message: "El DNI debe tener al menos 8 dígitos" },
          max: { value: 99999999, message: "El DNI debe tener máximo 8 dígitos" },
          valueAsNumber: true
        }}
      />

      <Inputs type="text" name="name" label="Nombre" required={true} register={register} isEditing={isEditing} />

      <PasswordInput name="password" label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"} showPassword={showPassword}
        setShowPassword={setShowPassword} required={!isEditing} register={register}
      />

      <SelectInput name="role" label="Rol" options={roleOptions} required={true} register={register} placeholder="Seleccionar rol..." />

      <Inputs type="email" name="email" label="Email (Opcional)" register={register} isEditing={isEditing} />
    </div>
  );
}