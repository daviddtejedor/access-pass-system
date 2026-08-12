import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Horario, } from "@/app/types/index";
import { Modal, Boton } from "@/app/components/index.components";
import { minToTime } from '@/app/utils/index.utils';
import { Reloj } from "@/app/assets/index.assets";
import { motion } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dayName: string;
  currentHorarios: Horario[];
  onSave: (updatedHorarios: Horario[]) => void;
};

const HorarioEditorModal = ({ isOpen, onClose, dayName, currentHorarios, onSave }: Props) => {
  const [modalHorarios, setModalHorarios] = useState<Horario[]>([]); // Estado interno para los horarios que se editan en el modal
  const [newFrom, setNewFrom] = useState<string>(""); // Estado para el nuevo horario que se está añadiendo
  const [newTo, setNewTo] = useState<string>("");

  useEffect(() => {
    if (isOpen) { // Cuando el modal se abre, inicializa los horarios del modal con los actuales
      setModalHorarios([...currentHorarios]); // Copia profunda para no mutar el estado padre
      setNewFrom("");
      setNewTo("");
    }
  }, [isOpen, currentHorarios]);


  const timeToMin = (timeStr: string): number | null => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Valida formato HH:mm (24h)
  const isValidTime = (value: string) => /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(value);

  // Convierte entrada simple de números a formato HH:mm
  const formatTimeInput = (value: string): string => {
    // Si ya está en formato HH:mm, lo devuelve tal como está
    if (isValidTime(value)) return value;

    // Si es solo números
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length === 1) {
      // 1 dígito: "9" → "09:00"
      const hour = parseInt(numericValue);
      if (hour >= 0 && hour <= 23) return `${hour.toString().padStart(2, '0')}:00`;
    } else if (numericValue.length === 2) {
      // 2 dígitos: "14" → "14:00"
      const hour = parseInt(numericValue);
      if (hour >= 0 && hour <= 23) return `${hour.toString().padStart(2, '0')}:00`;
    }

    // Si no se puede formatear, devuelve el valor original
    return value;
  };

  // Función para detectar superposiciones de horarios
  const hasTimeOverlap = (newFrom: number, newTo: number, existingHorarios: Horario[]): boolean => {
    return existingHorarios.some(horario => {
      const existingFrom = horario.from ?? 0;
      const existingTo = horario.to ?? 0;

      // Verifica si hay superposición:
      // - El nuevo horario empieza antes de que termine el existente Y
      // - El nuevo horario termina después de que empiece el existente
      return newFrom < existingTo && newTo > existingFrom;
    });
  };

  const handleAddHorario = () => {
    // Formatear las entradas antes de validar
    const formattedFrom = formatTimeInput(newFrom);
    const formattedTo = formatTimeInput(newTo);

    if (!isValidTime(formattedFrom) || !isValidTime(formattedTo)) {
      alert("Por favor, ingresa horas válidas en formato HH:mm (ej: 09:30) o números simples (ej: 9, 14).");
      return;
    }

    const fromMin = timeToMin(formattedFrom);
    const toMin = timeToMin(formattedTo);

    if (fromMin === null || toMin === null || isNaN(fromMin) || isNaN(toMin)) {
      alert("Por favor, ingresa horas válidas para el nuevo horario.");
      return;
    }
    if (fromMin >= toMin) {
      alert("La hora 'Desde' debe ser anterior a la hora 'Hasta'.");
      return;
    }

    // Verificar superposiciones con horarios existentes
    if (hasTimeOverlap(fromMin, toMin, modalHorarios)) {
      alert(`El horario ${formattedFrom} - ${formattedTo} se superpone con un horario existente. Por favor, elige un rango de tiempo que no se superponga.`);
      return;
    }

    const nuevoHorario: Horario = {
      tempId: crypto.randomUUID(),
      from: fromMin,
      to: toMin,
    };

    setModalHorarios((prev) =>
      [...prev, nuevoHorario].sort((a, b) => (a.from ?? 0) - (b.from ?? 0))
    ); // Ordena al añadir
    setNewFrom(""); // Limpiar campos del nuevo horario
    setNewTo("");
  };

  const handleDeleteHorario = (tempId: string) => setModalHorarios((prev) => prev.filter((h) => h.tempId !== tempId));

  const handleSave = () => {
    onSave(modalHorarios);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Horarios para el día ${dayName}`}
      >
        <div className="space-y-4">
          <motion.div
            layout
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            {/* Lista de Horarios Existentes */}
            {modalHorarios.length > 0 ? (
              <div className="dark:bg-zinc-900 dark:text-white border border-gray-400 rounded-lg p-3 max-h-48 overflow-y-auto">
                <h4 className="font-semibold dark:text-white text-gray-900 mb-2">Horarios actuales:</h4>
                {modalHorarios.map((horario) => (
                  <div
                    key={horario.tempId}
                    className="flex justify-between items-center mb-2 last:mb-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <span className="hover:scale-102">
                        {minToTime(horario.from)} ― {minToTime(horario.to)} hs.
                      </span>
                    </motion.div>
                    <Boton onClick={() => handleDeleteHorario(horario.tempId ? horario.tempId : "")}
                      txt="Eliminar" size="sm" textColorClass="text-red-600" bgColorClass="bg-transparent"
                      hoverColorClass="hover:text-red-700 hover:scale-102" className="ml-2 font-semibold shadow-none"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-white">
                No hay horarios definidos para este día
              </p>
            )}
          </motion.div>

          {/* Añadir Nuevo Horario */}
          <div className="border-t-2 border-gray-400 pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Añadir nuevo horario:</h4>
            <div className="flex gap-2 mb-3">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Horario de entrada"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  onBlur={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    if (formatted !== e.target.value) {
                      setNewFrom(formatted);
                    }
                  }}
                  className="block py-1 px-1 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 hover:border-red-600 peer dark:bg-zinc-900 dark:text-white"

                  maxLength={5}
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
                  <Image alt="reloj" src={Reloj} />
                </span>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Horario de salida"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  onBlur={(e) => {
                    const formatted = formatTimeInput(e.target.value);
                    if (formatted !== e.target.value) {
                      setNewTo(formatted);
                    }
                  }}
                  className="block py-1 px-1 w-full text-sm dark:text-white text-gray-900 border-0 border-b-2 border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 hover:border-red-600 peer"
                  maxLength={5}
                />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
                  <Image alt="reloj" src={Reloj} />
                </span>
              </div>
            </div>
            <Boton onClick={handleAddHorario} txt="Añadir a la lista" bgColorClass="bg-red-600" textColorClass="text-white"
              hoverColorClass="hover:bg-red-700 hover:scale-102" className="w-full transition-all duration-75 ease-in-out shadow-md"
            />
          </div>

          {/* Botón de Guardar en el Modal */}
          <div className="flex justify-center border-t-2 border-gray-400 pt-4 mt-4">
            <Boton onClick={handleSave} txt="Guardar Cambios" bgColorClass="bg-green-600" textColorClass="text-white"
              hoverColorClass="hover:bg-green-700 hover:scale-102" className="transition-all duration-75 ease-in-out shadow-md"
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default React.memo(HorarioEditorModal);  