import React from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Boton } from "@/app/components/index.components";

type Props = {
  name: string;
  label: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  required?: boolean;
  register: any;
  className?: string;
  validation?: any;
};

const PasswordInput = ({ name, label, showPassword, setShowPassword, required = false, register, className, validation }: Props) => {
  return (
    <div className={`relative z-0 w-full ${className || ''}`}>
      <input
        id={`floating_${name}`}
        type={showPassword ? "text" : "password"}
        placeholder=" "
        className="dark:border-gray-400 dark:autofill:[-webkit-text-fill-color:white] dark:autofill:shadow-[inset_0_0_0px_1000px_rgb(24,24,27)] block pb-1 mt-2 py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-400 appearance-none hover:border-red-600 focus:outline-none focus:ring-0 focus:border-red-600 peer dark:bg-zinc-900 dark:text-gray-300 dark:caret-white"
        {...register(name, { required, ...validation })}
      />

      <label htmlFor={`floating_${name}`} className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-5 z-10 origin-[0] peer-focus:start-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 dark:bg-zinc-900 dark:text-gray-400 cursor-pointer">
        {label}
      </label>

      <Boton
        onClick={() => setShowPassword(!showPassword)} className="absolute shadow-none cursor-pointer top-1/2 right-1 -translate-y-1/2"
        textColorClass="text-gray-600 dark:text-gray-300" hoverColorClass="hover:text-gray-800 dark:hover:text-gray-400" bgColorClass="bg-transparent"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </Boton>
    </div>
  );
};

export default PasswordInput;
