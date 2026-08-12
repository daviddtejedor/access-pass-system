"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/index.context";
import { Banner, BannerB } from "@/app/assets/index.assets";
import { Boton, Inputs, PasswordInput } from "@/app/components/index.components";

export default function Home() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm();
  const { signin, errors: authErrors } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (data: any) => {
    const parsedData = { ...data, dni: Number(data.dni) };

    if (isNaN(parsedData.dni)) {
      alert("El DNI debe ser un número válido.");
      return;
    }

    const loggedInUser = await signin(parsedData);
    if (loggedInUser) router.push("/porton");

  });

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white min-h-screen dark:bg-zinc-900">
      <div className="flex flex-col items-center justify-center mb-8 mx-auto">
        {/*Tema Claro */}
        <Image
          src={BannerB}
          alt="AccessPass System"
          className="w-64 md:w-80 h-auto mb-10 mx-auto object-contain dark:hidden"
          priority
        />

        {/*Tema Oscuro */}
        <Image
          src={Banner}
          alt="AccessPass System"
          className="w-64 md:w-80 h-auto mb-10 mx-auto object-contain hidden dark:block"
          priority
        />
        <h1 className=" mt-3 text-3xs font-bold text-gray-900 md:text-3xl dark:text-white">Inicio de Sesión</h1>

        {authErrors && authErrors.length > 0 && (
          <div className="text-red-500 p-2">
            {authErrors.map((errorMsg, index) => (
              <p key={index}>{errorMsg}</p>
            ))}
          </div>
        )}
      </div>

      <form className="max-w-lg w-full grid grid-cols-1 gap-6 items-center justify-center" onSubmit={onSubmit}>
        <Inputs type="number" name="dni" label="DNI" required={true} register={register}
          validation={{
            required: "El DNI es obligatorio", valueAsNumber: true,
            min: { value: 10000000, message: "El DNI debe tener al menos 8 dígitos" },
            max: { value: 99999999, message: "El DNI debe tener máximo 8 dígitos" }
          }}
        />
        {formErrors.dni && (<p className="text-red-500 text-xs">{formErrors.dni.message?.toString()}</p>)}

        <PasswordInput name="password" label="Contraseña" showPassword={showPassword} setShowPassword={setShowPassword} required={true} register={register}
          validation={{ required: "La contraseña es obligatoria" }}
        />
        {formErrors.password && (<p className="text-red-500 text-xs">{formErrors.password.message?.toString()}</p>)}

        <div className="flex justify-center w-full mt-4">
          <Boton type="submit" txt="Iniciar Sesión" bgColorClass="bg-red-600" textColorClass="text-white" hoverColorClass="hover:bg-red-700 hover:scale-105"
            className="w-full mx-auto py-2 px-4 rounded-lg font-bold focus:outline-none focus:shadow-outline transition-all duration-150 ease-in-out shadow-md justify-center"
          />
        </div>
      </form>
    </div>
  );
}
