"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@/app/context/index.context";
import { getHomeAdminBtnClasses } from "@/app/utils/index.utils";
import { UserTable, Boton, SelectInput, Modal } from "@/app/components/index.components";
import { motion } from "framer-motion";

export default function HomeAdmin() {
  const router = useRouter();
  const { user: currentUser, loading: isAuthChecking, isAuthenticated } = useAuth();
  const { getFilterUsers, deleteUser, userTable, pagination } = useUser();

  const [usersTableLoading, setUsersTableLoading] = useState(false);
  const [filters, setFilters] = useState({ disabled: "all", role: "all" });

  /* PAGINADO */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  /* 💡 ESTADO PARA REEMPLAZAR WINDOW.CONFIRM */
  const [userToDelete, setUserToDelete] = useState<{ id: string; dni: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activityOptions = [
    { value: "all", label: "Todos los usuarios" },
    { value: "active", label: "Usuarios activos" },
    { value: "inactive", label: "Usuarios inactivos" },
  ];

  const roleOptions = [
    { value: "all", label: "Todos los usuarios" },
    { value: "ADMIN", label: "Administradores" },
    { value: "EMPLOYEE", label: "Empleados" },
    { value: "PASSANT", label: "Pasantes" },
  ];

  // --- Handlers de Filtrado ---

  const handleFilter = useCallback(
    async (page: number, role: string, disabled: string) => {
      setUsersTableLoading(true);
      try {
        setCurrentPage(page);
        await getFilterUsers(role, disabled, page, itemsPerPage);
      } catch (error) {
        console.error("Error al filtrar usuarios en HomeAdmin:", error);
      } finally {
        setUsersTableLoading(false);
      }
    },
    [getFilterUsers, itemsPerPage]
  );

  const updateFilter = (key: "role" | "disabled", value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // --- Handlers de Acciones ---

  const handleAddUser = () => router.push("/altauser");

  const handleEdit = (id: string) => router.push(`/altauser?id=${id}`);

  // 1. ABRIR MODAL GUARDANDO EL USUARIO SELECCIONADO
  const handleDeleteRequest = (id: string, dni: number) => {
    setUserToDelete({ id, dni });
  };

  // 2. EJECUTAR LA ELIMINACIÓN AL CONFIRMAR EN EL MODAL
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      await handleFilter(currentPage, filters.role, filters.disabled);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Handlers de Paginación ---

  const handleNextPage = () =>
    pagination?.hasNextPage ? handleFilter(currentPage + 1, filters.role, filters.disabled) : null;

  const handlePrevPage = () =>
    pagination?.hasPrevPage ? handleFilter(currentPage - 1, filters.role, filters.disabled) : null;

  const handlePageClick = (page: number) => handleFilter(page, filters.role, filters.disabled);

  // --- Efecto Principal ---

  useEffect(() => {
    if (isAuthChecking || !isAuthenticated || !currentUser) return;
    handleFilter(1, filters.role, filters.disabled);
  }, [isAuthChecking, isAuthenticated, currentUser, handleFilter, filters.role, filters.disabled]);

  // --- Renderizado Condicional Inicial ---

  if (isAuthChecking) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700 dark:text-gray-200">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <p>No autenticado</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="mt-15 max-w-screen md:mt-19 md:max-w-7xl mx-auto p-3 dark:bg-zinc-900">
        {/* Controles de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center m-2 mb-5 mx-auto">
          <SelectInput
            name="roleFilterB"
            label="Filtrar por Rol:"
            options={roleOptions}
            value={filters.role}
            onChange={(e) => updateFilter("role", e.target.value)}
          />

          <SelectInput
            name="activityFilterB"
            label="Filtrar por Actividad:"
            options={activityOptions}
            value={filters.disabled}
            onChange={(e) => updateFilter("disabled", e.target.value)}
          />

          <Boton
            txt="Agregar Usuario"
            bgColorClass="bg-green-600 dark:bg-green-800"
            hoverColorClass="hover:bg-green-700 dark:hover:bg-green-900"
            onClick={handleAddUser}
          />
        </div>

        {/* Tabla con prop isLoading */}
        <UserTable
          users={userTable || []}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest} // 👈 Pasa la función que abre el modal
          currentUserId={currentUser?._id}
          isLoading={usersTableLoading}
        />

        {/* Controles de Paginación */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6">
            <div className="flex justify-center items-center gap-2">
              <Boton
                txt="←"
                bgColorClass="bg-gray-300"
                hoverColorClass="hover:bg-gray-400"
                textColorClass="text-gray-700"
                className="dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white"
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage}
              />

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) pageNumber = i + 1;
                  else if (currentPage <= 3) pageNumber = i + 1;
                  else if (currentPage >= pagination.totalPages - 2)
                    pageNumber = pagination.totalPages - 4 + i;
                  else pageNumber = currentPage - 2 + i;

                  const pageButtonClasses = getHomeAdminBtnClasses(pageNumber === currentPage);
                  return (
                    <Boton
                      txt={pageNumber.toString()}
                      key={pageNumber}
                      onClick={() => handlePageClick(pageNumber)}
                      size="sm"
                      {...pageButtonClasses}
                    />
                  );
                })}
              </div>

              <Boton
                txt="→"
                bgColorClass="bg-gray-300"
                hoverColorClass="hover:bg-gray-400"
                textColorClass="text-gray-700"
                className="dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
              />
            </div>

            <div className="text-sm text-gray-600 text-center mt-3 dark:text-white">
              <p>
                Página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems}{" "}
                usuarios total)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 💡 MODAL DE CONFIRMACIÓN DE ELIMINACIÓN REUTILIZANDO TU COMPONENTE */}
      <Modal
        isOpen={Boolean(userToDelete)}
        onClose={() => !isDeleting && setUserToDelete(null)}
        title="Eliminar Usuario"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            ¿Estás seguro de que deseas eliminar al usuario con DNI{" "}
            <strong>{userToDelete?.dni}</strong>? Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <Boton
              txt="Cancelar"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting}
              bgColorClass="bg-gray-400 dark:bg-zinc-700"
              textColorClass="text-white"
              hoverColorClass="hover:bg-gray-500 dark:hover:bg-zinc-600"
            />
            <Boton
              txt={isDeleting ? "Eliminando..." : "Sí, eliminar"}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              bgColorClass="bg-red-600"
              textColorClass="text-white"
              hoverColorClass="hover:bg-red-700"
            />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}