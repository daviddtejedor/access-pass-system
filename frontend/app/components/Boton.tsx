import Image from 'next/image';

type Props = {
  txt?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  bgColorClass?: string;
  hoverColorClass?: string;
  textColorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  img?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Boton = ({ txt = "", type = 'button', onClick, bgColorClass, img, disabled = false, className = '',
  hoverColorClass = 'hover:bg-green-700', textColorClass = 'text-white', size = 'md', children }: Props) => {

  // Mapeo de los tamaños predefinidos a clases de Tailwind CSS
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`cursor-pointer justify-center flex items-center gap-2 rounded-lg transition-all duration-150 ease-in-out shadow-md
        ${className} ${bgColorClass} ${textColorClass} ${hoverColorClass} ${sizeClasses[size]}
        ${disabled ? 'disabled:opacity-50 disabled:cursor-not-allowed' : 'hover:scale-105'}
      `}
    >
      {txt}
      {children}
      {img && <Image alt={txt} src={img} className="w-4 h-auto pt-1" priority />}
    </button>
  );
};

export default Boton;