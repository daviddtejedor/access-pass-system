"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app//context/index.context";
import { Logo } from "@/app/assets/index.assets";
import { Boton } from "@/app/components/index.components";
import { BiMenu, BiX } from 'react-icons/bi';
import { getNavBtnClasses } from "@/app/utils/index.utils";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { signout, user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    let lastScrolly = window.scrollY;

    const controlNavBar = () => {
      const currentScrollY = window.scrollY;

      // Si el usuario ha hecho scroll hacia abajo y la barra de navegación está visible, ocultarla, sino, mostrarla
      currentScrollY > lastScrolly && isVisible ? setIsVisible(false) : setIsVisible(true);

      lastScrolly = currentScrollY;
    };

    window.addEventListener("scroll", controlNavBar);
    return () => window.removeEventListener("scroll", controlNavBar);
    // ...existing code...
  }, []);

  const handleSignout = async () => {
    await signout();
    router.push("/");
  };
  const navigateToPorton = () => {
    router.push("/porton");
    toggleMobileMenu();
  };
  const navigateToHomeAdmin = () => {
    router.push("/home-admin");
    toggleMobileMenu();
  };

  const portonClasses = getNavBtnClasses(pathname === "/porton");
  const homeAdminClasses = getNavBtnClasses(pathname === "/home-admin");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={`fixed w-full bg-gray-200 dark:bg-zinc-800 top-0 z-50 transition-transform duration-150 ${isVisible ? " translate-y-0 " : " -translate-y-full "} ${isMobileMenuOpen ? "rounded-b-3xl md:rounded-b-none" : "rounded-b-none"}`}>

      <div className="flex justify-between items-center h-15 p-4">
        <Image
          alt="AccessPass Logo"
          src={Logo}
          className="h-14 w-auto object-contain"
          priority
        />

        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-3xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            {isMobileMenuOpen ? (<BiX className="text-3xl dark:text-white" />) : (<BiMenu className="text-3xl dark:text-white" />)}
          </button>
        </div>

        {/* Botones de navegación pantallas grandes*/}
        <div className="hidden md:flex items-center gap-4">
          <Boton txt="Portón" onClick={navigateToPorton} {...portonClasses} className="border-0 font-medium" size="md" />

          {/* Botón Gestión - Solo para admins */}
          {user?.role === "ADMIN" && (
            <Boton txt="Gestión" onClick={navigateToHomeAdmin} {...homeAdminClasses} className=" border-0 font-medium" size="md" />
          )}

          {/* Boton modo oscuro*/}
          <Boton
            onClick={toggleTheme}
            className="font-medium p-2 flex items-center gap-2"
            bgColorClass='bg-neutral-50 dark:bg-neutral-600'
            hoverColorClass='hover:bg-gray-100 dark:hover:bg-neutral-700'
            textColorClass='text-gray-900 dark:text-white'
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
          </Boton>

          {/* Botón Cerrar Sesión - Siempre visible para todos */}
          <Boton txt="Cerrar Sesión" onClick={handleSignout} bgColorClass="bg-red-600" hoverColorClass="hover:bg-red-700" className="font-medium" />

        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden transition-all duration-150 ease-in-out">
          <div className="flex flex-col gap-3 pb-4 m-4">

            {/* Botón Portón - Siempre visible para todos */}
            <Boton txt="Portón" onClick={navigateToPorton} {...portonClasses} className="font-medium" size="md" />

            {/* Botón Gestión - Solo para admins */}
            {user?.role === "ADMIN" && (
              <Boton txt="Gestión" onClick={navigateToHomeAdmin} {...homeAdminClasses} className="font-medium" size="md" />
            )}

            {/* Boton modo oscuro*/}
            <Boton
              onClick={toggleTheme}
              className="font-medium p-2 flex items-center gap-2"
              bgColorClass='bg-neutral-50 dark:bg-neutral-600'
              hoverColorClass='hover:bg-gray-100 dark:hover:bg-neutral-700'
              textColorClass='text-gray-900 dark:text-white'
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
            </Boton>

            {/* Botón Cerrar Sesión - Siempre visible para todos */}
            <Boton txt="Cerrar Sesión" onClick={handleSignout} bgColorClass="bg-red-600" hoverColorClass="hover:bg-red-700" className="font-medium" />

          </div>
        </div>
      )}

    </nav>
  );
}