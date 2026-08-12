"use client";
import { useAuth } from "@/app/context/index.context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { UserProvider } from "@/app/context/UserContext";
import { PortonProvider } from "@/app/context/PortonContext";
import { NavBar } from "@/app/components/index.components";

const PERMISSIONS: Record<string, string[]> = {
  EMPLOYEE: ["/porton"],
  PASSANT: ["/porton"],
  ADMIN: ["/porton", "/home-admin", "/altauser"]
};

function canAccess(role: string | undefined, path: string) {
  if (!role) return false;
  const allowed = PERMISSIONS[role];
  if (!allowed) return false;
  return allowed.some((p) => path.startsWith(p)); // Verifica si el path comienza con alguno de los permitidos
}

export default function ProtectedLayout({ children }: { children: React.ReactNode; }) {
  const { isAuthenticated, loading: isAuthChecking, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthChecking) return;
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    if (!canAccess(user?.role, pathname)) { // Redirigir según el rol
      if (user?.role === "EMPLOYEE" || user?.role === "PASSANT") router.push("/porton");
      else if (user?.role === "ADMIN") router.push("/porton");
      else router.push("/");
    }
  }, [isAuthenticated, isAuthChecking, user, router, pathname]);

  if (isAuthChecking) return <p>Cargando autenticación...</p>;
  if (!isAuthenticated || !canAccess(user?.role, pathname)) return null;

  return (
    <div className="dark:bg-zinc-900">
      <UserProvider>
        <PortonProvider>
          <NavBar />
          {children}
        </PortonProvider>
      </UserProvider>
    </div>
  );
}