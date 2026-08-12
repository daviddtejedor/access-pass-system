import React from "react";
import { Boton } from "@/app/components/index.components";
interface ModalProps {
  isOpen: boolean; // controla la visibilidad
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900  rounded-xl opacity-100 shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
        <Boton onClick={onClose} textColorClass="text-black dark:text-white" hoverColorClass="hover:bg-gray-300" bgColorClass="bg-transparent dark:bg-zinc-800"
          className="absolute shadow-none top-4 right-4 flex items-center justify-center text-black text-xl rounded-full w-7 h-7 hover:bg-gray-300"
        >
          &times;
        </Boton>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;