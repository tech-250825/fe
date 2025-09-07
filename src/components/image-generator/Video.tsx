import React from 'react';

interface VideoProps {
  className?: string;
  color?: string;
}

export const Video: React.FC<VideoProps> = ({ className = "", color = "#1E1E1E" }) => {
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
        y="10" 
        width="28" 
        height="20" 
        rx="2" 
        stroke={color} 
        strokeWidth="2"
      />
      <path 
        d="M34 14L42 10V30L34 26V14Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};