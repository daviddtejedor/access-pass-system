"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/index.context";
import { User, CreateUserPayload, DiaHorario } from "@/app/types";
import { Boton, UserDataForm, ScheduleManager, Modal } from "../../components/index.components"; // 👈 Usamos tu Modal actual
import { motion } from "framer-motion";

export default function AltaUsuario() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { addUser, updateUser, getUserById } = useUser();
  const [schedule, setSchedule] = useState<DiaHorario[]>([]);

  // Estados existentes para el ScheduleManager
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const router = useRouter();
  const searchParam = useSearchParams();
  const userId = searchParam.get("id");
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 💡 1. NUEVOS ESTADOS LOCALES PARA CONFIRMACIÓN Y ERRORES
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<CreateUserPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setIsEditing(true);

      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const userFound = await getUserById(userId);

          if (userFound) {
            setEditingUser(userFound);
            setValue("dni", userFound.dni);
            setValue("name", userFound.name);
            setValue("email", userFound.email?.[0] || "");
            setValue("role", userFound.role);
            setValue("password", "");

            if (userFound.schedule && userFound.schedule.length > 0) {
              const formattedSchedule: DiaHorario[] = userFound.schedule.map((s: DiaHorario) => ({
                weekDay: s.weekDay,
                timeRanges: s.timeRanges.map((tr) => ({
                  tempId: Math.random().toString(36).substring(2, 9),
                  from: tr.from,
                  to: tr.to,
                  _id: tr._id,
                })),
              }));
              setSchedule(formattedSchedule.sort((a, b) => a.weekDay - b.weekDay));
            } else {
              setSchedule([]);
            }
          } else {
            console.error("Usuario no encontrado");
            setErrorMessage("Usuario no encontrado.");
            router.push("/home-admin");
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario para edición:", error);
          setErrorMessage("Error al cargar los datos del usuario.");
          router.push("/home-admin");
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    } else {
      setIsEditing(false);
      setEditingUser(null);
      reset();
      setSchedule([]);
    }
  }, [userId, getUserById, setValue, reset, router]);

  // 💡 2. VALIDA Y PREPARA EL PAYLOAD (NO INVOCA A LA DB TODAVÍA)
  const onSubmit = handleSubmit((data) => {
    setErrorMessage(null);

    const isValidSchedule = schedule.every((day) =>
      day.timeRanges.every((horario) => horario.from !== null && horario.to !== null)
    );

    if (!isValidSchedule) {
      setErrorMessage("Por favor, completa todos los horarios antes de enviar.");
      return;
    }

    if (!isEditing && (!data.password || data.password.length === 0)) {
      setErrorMessage("La contraseña es requerida para un nuevo usuario.");
      return;
    }

    const cleanedSchedule: DiaHorario[] = schedule.map((day) => ({
      weekDay: day.weekDay,
      timeRanges: day.timeRanges
        .map(({ tempId, ...rest }) => ({ ...rest, from: rest.from!, to: rest.to! }))
        .sort((a, b) => (a.from ?? 0) - (b.from ?? 0)),
    }));

    const emailToSend = data.email ? [data.email] : undefined;

    const payload: Partial<CreateUserPayload> = {
      dni: parseInt(data.dni as unknown as string),
      name: data.name,
      email: emailToSend,
      role: data.role,
      schedule: cleanedSchedule,
    };

    if (data.password && data.password.length > 0) payload.password = data.password;

    // Guardamos la data validada en el estado y abrimos tu Modal existente
    setPendingData(payload as CreateUserPayload);
    setIsConfirmOpen(true);
  });

  // 💡 3. EJECUTA LA ACCIÓN EN DB LUEGO DE DARLE A "CONFIRMAR" EN EL MODAL
  const handleConfirmAction = async () => {
    if (!pendingData) return;

    setIsLoading(true);
    setIsConfirmOpen(false); // Cerramos el modal de confirmación

    try {
      if (isEditing && editingUser?._id) {
        await updateUser(editingUser._id, pendingData);
      } else {
        await addUser(pendingData);
      }
      reset();
      setSchedule([]);
      setPendingData(null);
      router.push("/home-admin");
    } catch (error: any) {
      console.error(`Error al ${isEditing ? "actualizar" : "agregar"} usuario:`, error);
      setErrorMessage(`Error al ${isEditing ? "actualizar" : "agregar"} usuario: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] p-4 sm:p-6 relative shadow-lg overflow-y-auto dark:bg-zinc-900">
          <div className="min-h-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] p-4 sm:p-6 relative shadow-lg overflow-y-auto dark:bg-zinc-900">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="min-h-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {isEditing ? `Modificar Usuario: ${editingUser?.name || ''}` : "Agregar Nuevo Usuario"}
          </h2>

          {/* Cartel de error sutil si falla la validación o la API */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 rounded-lg flex justify-between items-center text-sm">
              <span>{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage(null)} className="font-bold ml-2">✕</button>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <UserDataForm register={register} isEditing={isEditing} showPassword={showPassword} setShowPassword={setShowPassword} />
            <ScheduleManager schedule={schedule} setSchedule={setSchedule} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} selectedDayIndex={selectedDayIndex} setSelectedDayIndex={setSelectedDayIndex} />

            <div className="flex justify-end border-t-2 pt-4 border-gray-400">
              <Boton
                txt={isEditing ? "Guardar Cambios" : "Agregar usuario"}
                type="submit"
                bgColorClass="bg-green-600"
                textColorClass="text-white"
                hoverColorClass="hover:bg-green-700"
                className="hover:scale-105 transition-all duration-150 ease-in-out shadow-md"
              />
              <Boton
                onClick={() => router.push("/home-admin")}
                txt="Cancelar"
                bgColorClass="bg-red-600"
                textColorClass="text-white"
                hoverColorClass="hover:bg-red-700"
                className="ml-3 hover:scale-105 transition-all duration-150 ease-in-out shadow-md"
              />
            </div>
          </form>
        </motion.div>
      </div>

      {/* 💡 4. USO DIRECTO DE TU COMPONENTE MODAL EXISTENTE */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={isEditing ? "Confirmar Modificación" : "Confirmar Nuevo Usuario"}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {isEditing ? (
              <>¿Estás seguro de que deseas guardar los cambios aplicados a <strong>{pendingData?.name}</strong>?</>
            ) : (
              <>¿Estás seguro de que deseas dar de alta al usuario <strong>{pendingData?.name}</strong> (DNI: {pendingData?.dni})?</>
            )}
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <Boton
              txt="Cancelar"
              onClick={() => setIsConfirmOpen(false)}
              bgColorClass="bg-gray-400 dark:bg-zinc-700"
              textColorClass="text-white"
              hoverColorClass="hover:bg-gray-500 dark:hover:bg-zinc-600"
            />
            <Boton
              txt={isEditing ? "Sí, modificar" : "Sí, agregar"}
              onClick={handleConfirmAction}
              bgColorClass="bg-green-600"
              textColorClass="text-white"
              hoverColorClass="hover:bg-green-700"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}