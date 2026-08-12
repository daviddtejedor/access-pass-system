// src/components/ScheduleManager.tsx
import React, { useMemo, useCallback } from 'react';
import { DiaHorario, Horario } from "@/app/types"; // Importa tus tipos
import { HorarioEditorModal } from "@/app/components/index.components"; // El modal de edición de horarios
import { minToTime } from '@/app/utils/index.utils'; // Tu utilidad para formato de tiempo
import { Boton } from "@/app/components/index.components";

interface ScheduleManagerProps {
  schedule: DiaHorario[];
  setSchedule: React.Dispatch<React.SetStateAction<DiaHorario[]>>;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedDayIndex: number | null;
  setSelectedDayIndex: (index: number | null) => void;
}

const diasSemanaCompleto = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function ScheduleManager({
  schedule,
  setSchedule,
  isModalOpen,
  setIsModalOpen,
  selectedDayIndex,
  setSelectedDayIndex,
}: ScheduleManagerProps) {

  const diasDisponibles = useMemo(() => {
    const diasSeleccionadosIndices = new Set(schedule.map((d) => d.weekDay));
    return diasSemanaCompleto
      .map((dia, index) => ({ name: dia, index: index }))
      .filter((dia) => !diasSeleccionadosIndices.has(dia.index));
  }, [schedule]);

  const agregarDia = useCallback(
    (diaIndex: number) => {
      if (schedule.some((d) => d.weekDay === diaIndex)) {
        console.warn(`El día ${diasSemanaCompleto[diaIndex]} ya está agregado.`);
        return;
      }
      setSchedule((prev) => [...prev, { weekDay: diaIndex, timeRanges: [] }].sort((a, b) => a.weekDay - b.weekDay));
    },
    [schedule, setSchedule]
  );

  const eliminarDia = useCallback((diaIndex: number) => {
    setSchedule((prev) => prev.filter((d) => d.weekDay !== diaIndex));
  }, [setSchedule]);

  const openHorarioModal = useCallback((dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setIsModalOpen(true);
  }, [setSelectedDayIndex, setIsModalOpen]);

  const closeHorarioModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDayIndex(null);
  }, [setIsModalOpen, setSelectedDayIndex]);

  const handleHorariosSaved = useCallback(
    (updatedHorarios: Horario[]) => {
      if (selectedDayIndex === null) return;
      setSchedule((prev) => prev.map((d) => d.weekDay === selectedDayIndex ? { ...d, timeRanges: updatedHorarios } : d));
    }, [selectedDayIndex, setSchedule]
  );

  const currentDayHorarios = useMemo(() => {
    if (selectedDayIndex === null) return [];
    const day = schedule.find((d) => d.weekDay === selectedDayIndex);
    return day ? day.timeRanges.map((h) => ({ ...h, tempId: h.tempId ?? Math.random().toString(36).substring(2, 9) })) : [];
  }, [schedule, selectedDayIndex]);

  return (
    <>
      <h3 className="text-lg font-semibold text-gray-900 mt-5 mb-3 dark:text-white">Horarios</h3>
      <div className="mb-4">
        {diasDisponibles.length > 0 ? (
          <select
            className="cursor-pointer border-0 border-b-2 border-gray-400 px-0 py-1 hover:border-red-700 focus:border-red-700 focus:outline-none bg-transparent appearance-none dark:border-gray-400 dark:text-gray-300 dark:bg-zinc-900"
            onChange={(e) => agregarDia(parseInt(e.target.value))}
            value=""
          >
            <option value="" disabled>
              Seleccionar día para agregar...
            </option>
            {diasDisponibles.map((dia) => (
              <option key={dia.index} value={dia.index}>
                {dia.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500 dark:text-white">Todos los días están agregados.</p>
        )}
      </div>

      <div className="flex gap-4 mb-1 pb-5 overflow-x-auto">
        {schedule.length === 0 ? (
          <p className="text-gray-500 text-center py-2 px-2 mx-auto rounded-lg border-3 border-gray-400 border-dashed inline-block dark:text-white">
            No hay horarios asignados
          </p>
        ) : (
          schedule.map((diaHorario) => (
            <div
              key={diaHorario.weekDay}
              className="flex flex-col flex-grow items-center p-3 max-w-45 border-b-2 border-gray-400 hover:border-red-600 hover:scale-102 transition-all duration-150 dark:text-white"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-medium">
                  {diasSemanaCompleto[diaHorario.weekDay]}
                </span>
                <Boton
                  onClick={() => eliminarDia(diaHorario.weekDay)}
                  className="text-gray-900  dark:text-white text-xl rounded-full w-7 h-7 flex items-center justify-center"
                  textColorClass="text-gray-900 dark:text-white" hoverColorClass="hover:bg-gray-300 dark:hover:bg-zinc-600 hover:text-black shadow-none"
                >
                  ×
                </Boton>
              </div>

              <div className="flex flex-col items-center gap-2 w-full">
                {diaHorario.timeRanges.length > 0 ? (
                  <ul className="list-none text-center text-sm">
                    {diaHorario.timeRanges
                      .sort((a, b) => (a.from ?? 0) - (b.from ?? 0))
                      .map((h) => (
                        <li key={h.tempId} className="text-center text-xs">
                          {minToTime(h.from)} - {minToTime(h.to)}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs dark:text-white">Sin horarios</p>
                )}
                <Boton onClick={() => openHorarioModal(diaHorario.weekDay)} txt="Editar horario" bgColorClass="bg-red-600"
                  textColorClass="text-white" hoverColorClass="hover:bg-red-700" size="sm"
                  className="mt-2 w-full transition-all duration-300 ease-in-out shadow-md"
                />
              </div>
            </div>
          ))
        )}
      </div >

      {/* Modal para editar horarios */}
      {
        isModalOpen && selectedDayIndex !== null && (
          <HorarioEditorModal
            isOpen={isModalOpen}
            onClose={closeHorarioModal}
            dayName={diasSemanaCompleto[selectedDayIndex]}
            currentHorarios={currentDayHorarios}
            onSave={handleHorariosSaved}
          />
        )
      }
    </>
  );
}