import React from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  register?: any;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showFloatingLabel?: boolean;
};

const SelectInput = ({ name, label, options, required = false, register, className, placeholder = "Seleccionar...", value, onChange, showFloatingLabel = true }: Props) => {

  // Si no se proporciona register, usar value y onChange directamente
  const selectProps = register ? { ...register(name, { required }) } : { value, onChange };

  if (!showFloatingLabel) { // Versión simple sin floating label para filtros
    return (
      <select
        className={`cursor-pointer px-1 py-2 border-b-2 border-gray-400 bg-transparent text-gray-700 hover:border-red-600 focus:outline-none appearance-none transition-all dark:border-gray-400 dark:text-gray-300 dark:bg-zinc-900 ${className || ''}`}
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={`relative z-0 w-full ${className || ''}`}>
      <label htmlFor={`floating_${name}`} className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-5 z-10 origin-[0] peer-focus:start-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 dark:bg-zinc-900 dark:text-gray-400">
        {label}
      </label>
      <select
        className="pb-1 mt-2 cursor-pointer border-0 border-b-2 border-gray-400 py-2.5 px-0 w-full text-sm text-gray-900 hover:border-red-600 focus:border-red-600 focus:outline-none bg-transparent appearance-none peer dark:border-gray-400 dark:text-gray-300 dark:bg-zinc-900"
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
