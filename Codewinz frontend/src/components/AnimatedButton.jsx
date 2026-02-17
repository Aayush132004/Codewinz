import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

function AnimatedButton({
  children,
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',
  size = 'md',
  className = ''
}) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative overflow-hidden font-bold transition-all duration-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-700/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-zinc-200 shadow-md transition-all duration-300',
    secondary: 'bg-gradient-to-r from-zinc-800 to-zinc-700 text-white hover:from-zinc-700 hover:to-zinc-600 border border-zinc-700/50',
    outline: 'border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500'
  };
  
  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} group`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Ripple effect */}
      <div className={`absolute inset-0 bg-white/30 rounded-2xl transform scale-0 group-active:scale-100 transition-transform duration-200 ${isPressed ? 'scale-100' : ''}`} />
      
      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{children}</span>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
    </button>
  );
}

export default AnimatedButton;