import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'civilian' | 'hero';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-sans text-sm font-black uppercase tracking-wide rounded-full border-2 border-comic-black shadow-comic active:shadow-none active:translate-x-1 active:translate-y-1 transition-all py-3 px-5 min-h-[48px] h-auto whitespace-normal leading-tight break-words relative overflow-hidden";
  
  const variants = {
    primary: "bg-comic-yellow text-[#161616] hover:bg-[#FFE45A]",
    secondary: "bg-[#3E3E3E] text-[#F4F4F0] hover:bg-[#4A4A4A]",
    danger: "bg-comic-red text-white hover:bg-[#F07167]",
    civilian: "bg-[#3A3A3A] text-[#F4F4F0] hover:bg-[#464646]",
    hero: "bg-[#FFD21F] text-[#161616] hover:bg-[#FFE45A]",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
