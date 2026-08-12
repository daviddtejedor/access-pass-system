import { User, RoleMap } from "@/app/types";
import { Editar, Borrar } from "@/app/assets/index.assets";
import { minToTime } from '@/app/utils/index.utils';
import { Boton } from "@/app/components/index.components";

interface UserTableProps {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string, dni: number) => void | Promise<void>;
  currentUserId?: string;
  isLoading?: boolean;
}

export default function UserTable({ users, onEdit, onDelete, currentUserId, isLoading = false }: UserTableProps) {
  const filteredUsers = users.filter(user => user._id !== currentUserId) || [];

  const classTH = "px-2 py-2 text-center border-r border-gray-300 text-xs dark:border-gray-600";
  const classTD = "px-2 py-2 border-r hover:text-black hover:scale-105 border-gray-300 whitespace-nowrap text-xs dark:border-gray-600 dark:hover:text-white";

  return (
    <div className="w-full overflow-x-auto md:overflow-x-clip rounded-lg shadow-md border border-gray-200 dark:border-gray-600 dark:hover:text-white">
      <table className="w-full text-xs">
        <thead className="bg-gray-200 dark:bg-zinc-900">
          <tr className="text-gray-900 font-semibold uppercase tracking-wider dark:text-white">
            <th className={classTH}>Nombre</th>
            <th className={classTH}>DNI</th>
            <th className={classTH}>Email</th>
            <th className={classTH}>Rol</th>
            <th className={classTH}>Actividad</th>
            <th className={classTH}>Días/Horarios</th>
            <th className={classTH}>Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-gray-800 dark:bg-neutral-800 dark:text-neutral-100 dark:divide-gray-600">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500 italic dark:text-gray-300">
                <span className="animate-pulse font-medium">Actualizando tabla...</span>
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500 italic dark:text-white">
                No se encontraron usuarios registrados (excluyendo tu cuenta).
              </td>
            </tr>
          ) : (
            filteredUsers.map((usuario: User) => (
              <tr key={usuario._id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-150">
                <td className={classTD}>{usuario.name}</td>
                <td className={classTD}>{usuario.dni}</td>
                <td className={classTD}>{usuario.email || "-"}</td>
                <td className={classTD}>{RoleMap[usuario.role] || usuario.role}</td>
                <td className={classTD}>{usuario.disabled ? "Inactivo" : "Activo"}</td>
                <td className={classTD}>
                  {usuario.schedule && usuario.schedule.length > 0 ? (
                    <ul className="list-disc list-inside marker:text-gray-700 text-xs dark:marker:text-white">
                      {usuario.schedule
                        .sort((a, b) => a.weekDay - b.weekDay)
                        .map((daySchedule, idx) => (
                          <li key={idx} className="mb-1 dark:text-white">
                            {[
                              "Lunes", "Martes", "Miércoles", "Jueves",
                              "Viernes", "Sábado", "Domingo",
                            ][daySchedule.weekDay]}:{" "}
                            {daySchedule.timeRanges && daySchedule.timeRanges.length > 0
                              ? daySchedule.timeRanges
                                .sort((a, b) => (a.from ?? 0) - (b.from ?? 0))
                                .map((range: { from: number | null; to: number | null; }) =>
                                  `${minToTime(range.from)} - ${minToTime(range.to)}`
                                )
                                .join(", ")
                              : "Sin definir"}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 italic text-xs">Sin horarios asignados</span>
                  )}
                </td>
                <td className="px-2 py-2">
                  <div className="flex justify-center gap-1">
                    <Boton txt="Editar" bgColorClass="bg-blue-600" hoverColorClass="hover:bg-blue-700" img={Editar} onClick={() => onEdit(usuario._id)} />
                    <Boton txt="Borrar" bgColorClass="bg-red-600" hoverColorClass="hover:bg-red-700" img={Borrar} onClick={() => onDelete(usuario._id, usuario.dni)} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}