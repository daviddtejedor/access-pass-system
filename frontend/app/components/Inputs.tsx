import React from 'react';

type Props = {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  register: any;
  readOnly?: boolean;
  validation?: any;
  className?: string;
  isEditing?: boolean;
};

const Inputs = ({ type, name, label, placeholder = " ", required = false, register, readOnly = false, validation, className, isEditing = false }: Props) => {

  // Para el campo DNI, debe ser editable solo cuando NO estamos editando (es decir, cuando estamos creando)
  const isFieldReadOnly = name === 'dni' ? isEditing : readOnly;

  const getInputClasses = () => {
    if (isFieldReadOnly) return "block pb-1 mt-2 py-2.5 px-0 w-full text-sm text-gray-500 dark:text-gray-600 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer cursor-not-allowed dark:text-gray-400 dark:border-gray-600";

    return "dark:border-gray-400 dark:autofill:[-webkit-text-fill-color:white] dark:autofill:shadow-[inset_0_0_0px_1000px_rgb(24,24,27)] block pb-1 mt-2 py-2.5 px-0 w-full text-sm text-gray-900 border-0 border-b-2 border-gray-400 appearance-none hover:border-red-600 focus:outline-none focus:ring-0 focus:border-red-600 peer dark:bg-zinc-900 dark:text-gray-300 dark:caret-white";
  };

  const getLabelClasses = () => {
    if (isFieldReadOnly) return "peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-5 z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 cursor-not-allowed";

    return "peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-5 z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 dark:bg-zinc-900 dark:text-gray-400";
  };

  return (
    <div className={`relative z-0 w-full ${className || ''}`}>
      <input
        id={`floating_${name}`}
        type={type}
        placeholder={placeholder}
        readOnly={isFieldReadOnly}
        className={getInputClasses()}
        {...register(name, { required, ...validation })} />

      <label htmlFor={`floating_${name}`} className={getLabelClasses()}>
        {label}
      </label>
    </div>
  );
};

export default Inputs;