import React from 'react';
import { cn } from '@/lib/utils';

interface CondominiumIconProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'brand' | 'outline';
}

export function CondominiumIcon({ 
  className = "", 
  size = 24, 
  variant = 'default' 
}: CondominiumIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-colors duration-200", className)}
    >
      {/* Estrutura principal do prédio */}
      <path 
        d="M19 2H5C3.895 2 3 2.895 3 4V20C3 21.105 3.895 22 5 22H19C20.105 22 21 21.105 21 20V4C21 2.895 20.105 2 19 2Z" 
        stroke="currentColor"
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Base do prédio */}
      <rect 
        x="3" y="20" width="18" height="2" 
        fill="currentColor"
        opacity="0.3"
      />
      
      {/* Janelas dos apartamentos - andar superior */}
      <rect 
        x="7" y="6" width="3" height="3" 
        fill="currentColor"
        opacity="0.8" 
        rx="0.5"
      />
      <rect 
        x="14" y="6" width="3" height="3" 
        fill="currentColor"
        opacity="0.8" 
        rx="0.5"
      />
      
      {/* Janelas dos apartamentos - andar do meio */}
      <rect 
        x="7" y="11" width="3" height="3" 
        fill="currentColor"
        opacity="0.6" 
        rx="0.5"
      />
      <rect 
        x="14" y="11" width="3" height="3" 
        fill="currentColor"
        opacity="0.6" 
        rx="0.5"
      />
      
      {/* Janelas dos apartamentos - andar inferior */}
      <rect 
        x="7" y="16" width="3" height="3" 
        fill="currentColor"
        opacity="0.4" 
        rx="0.5"
      />
      <rect 
        x="14" y="16" width="3" height="3" 
        fill="currentColor"
        opacity="0.4" 
        rx="0.5"
      />
      
      {/* Porta de entrada */}
      <rect 
        x="11" y="18" width="2" height="2" 
        fill="currentColor"
        rx="0.2"
      />
      
      {/* Antena/Logo no topo */}
      <circle 
        cx="12" cy="4.5" r="0.5" 
        fill="currentColor"
        opacity="0.7"
      />
      
      {/* Detalhes adicionais - linhas dos andares */}
      <line 
        x1="6" y1="10" x2="18" y2="10" 
        stroke="currentColor"
        strokeWidth="0.5" 
        opacity="0.3"
      />
      <line 
        x1="6" y1="15" x2="18" y2="15" 
        stroke="currentColor"
        strokeWidth="0.5" 
        opacity="0.3"
      />
    </svg>
  );
}

export default CondominiumIcon;
