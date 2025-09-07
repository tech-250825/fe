import React from 'react';

interface ChevronDownProps {
  className?: string;
}

export const ChevronDown: React.FC<ChevronDownProps> = ({ className = "" }) => {
  return (
    <svg 
      className={className} 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M8 12L16 20L24 12" 
        stroke="#B3B3B3" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};