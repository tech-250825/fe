import React from 'react';

interface MenuProps {
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({ className = "" }) => {
  return (
    <svg 
      className={className} 
      width="36" 
      height="36" 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M6 9H30M6 18H30M6 27H30" 
        stroke="#F5F5F5" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};