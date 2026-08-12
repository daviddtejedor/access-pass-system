"use client";
import Image from "next/image";
import { Banner, BannerB, Porton } from "@/app/assets/index.assets";
import { motion } from "framer-motion";
import { usePorton } from "@/app/context/index.context";
import { useState } from "react";

export default function PortonPage() {
  const { control, isLoading } = usePorton();
  const [portonStatus, setPortonStatus] = useState<string>("<abierta>");

  const handlePortonControl = async () => {
    let newStatus: string;

    if (portonStatus === "<abierta>") {
      newStatus = "<cerrada>";
    } else {
      newStatus = "<abierta>";
    }

    setPortonStatus(newStatus);

    await control(newStatus);
  };

  return (

    <div className="flex flex-col w-full items-center justify-center min-h-screen mx-auto bg-neutral-50 px-4 dark:bg-zinc-900">
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
      <motion.button
        onClick={handlePortonControl}
        disabled={isLoading}
        className={`cursor-pointer px-6 py-3 m-5 w-50 h-50 rounded-full font-semibold text-white ${isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
          }`}
        whileHover={!isLoading ? { scale: 1.1 } : {}}
        whileTap={!isLoading ? { scale: 0.9 } : {}}
        onHoverStart={() => !isLoading && console.log('hover started!')}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 2,
          scale: { type: "spring", visualDuration: 0.5, bounce: 0.5 },
        }}
      >
        <Image alt="Portón Icon" src={Porton} className="w-22 h-20 mx-auto mb-2" />
        {isLoading ? "Procesando..." : (portonStatus === "<abierta>" ? "Abrir" : "Cerrar")}
      </motion.button >
    </div >
  );
}
