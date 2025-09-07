import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ className = "", color = "#1E1E1E" }) => {
  return (
    <svg 
      className={className} 
      width="48" 
      height="48" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="6" 
        y="6" 
        width="36" 
        height="36" 
        rx="4" 
        stroke={color} 
        strokeWidth="2"
      />
      <circle cx="15" cy="15" r="3" fill={color} />
      <path 
        d="M6 36L18 24L24 30L30 24L42 36" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};