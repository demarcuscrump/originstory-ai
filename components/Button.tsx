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
  // Updated with font-display (Bangers) and larger text sizes for better readability
  const baseStyle = "font-display text-lg tracking-widest border-2 border-black shadow-comic active:shadow-none active:translate-x-1 active:translate-y-1 transition-all py-3 px-4 min-h-[50px] h-auto whitespace-normal leading-tight break-words relative overflow-hidden group";
  
  const variants = {
    primary: "bg-comic-yellow text-black hover:bg-yellow-300",
    secondary: "bg-white text-black hover:bg-gray-100",
    danger: "bg-comic-red text-white hover:bg-red-500",
    civilian: "bg-gray-200 text-black hover:bg-gray-300",
    hero: "bg-comic-blue text-white hover:bg-blue-600",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {/* Button Shine Effect */}
      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-500 pointer-events-none"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};