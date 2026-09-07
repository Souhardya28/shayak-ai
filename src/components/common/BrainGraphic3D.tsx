import React from 'react';

interface BrainGraphic3DProps {
  className?: string;
}

export const BrainGraphic3D: React.FC<BrainGraphic3DProps> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient soft glow */}
      <div className="absolute w-20 h-20 bg-pink-400/30 rounded-full blur-xl animate-pulse" />

      {/* 3D-Styled Stylized Pink Brain SVG */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="brainPinkGrad" x1="20" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff85b3" />
            <stop offset="0.5" stopColor="#f43f8e" />
            <stop offset="1" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id="brainHighlight" x1="30" y1="20" x2="50" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ff85b3" stopOpacity="0" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#831843" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Main Brain Body */}
        <g filter="url(#softShadow)">
          {/* Left Hemisphere lobes */}
          <path
            d="M48 24C41 22 34 23 28 28C22 33 21 40 22 46C18 49 16 55 18 61C20 67 24 71 30 73C33 76 38 78 43 78C46 78 48 76 48 72V24Z"
            fill="url(#brainPinkGrad)"
          />
          {/* Right Hemisphere lobes */}
          <path
            d="M52 24C59 22 66 23 72 28C78 33 79 40 78 46C82 49 84 55 82 61C80 67 76 71 70 73C67 76 62 78 57 78C54 78 52 76 52 72V24Z"
            fill="url(#brainPinkGrad)"
          />

          {/* Brain Stem */}
          <path
            d="M45 74C45 82 47 88 50 88C53 88 55 82 55 74H45Z"
            fill="#e11d48"
            opacity="0.9"
          />

          {/* Gyri & Sulci details (brain folds) */}
          <path
            d="M32 35C36 33 42 36 44 40M25 46C29 45 35 48 37 53M24 59C28 58 35 62 38 66M34 70C38 69 43 72 45 74"
            stroke="#ffb3d1"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M68 35C64 33 58 36 56 40M75 46C71 45 65 48 63 53M76 59C72 58 65 62 62 66M66 70C62 69 57 72 55 74"
            stroke="#ffb3d1"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Central fissure */}
          <path
            d="M50 24V74"
            stroke="#9f1239"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Top volumetric highlight */}
          <ellipse
            cx="38"
            cy="31"
            rx="8"
            ry="4"
            transform="rotate(-20 38 31)"
            fill="url(#brainHighlight)"
          />
          <ellipse
            cx="62"
            cy="31"
            rx="8"
            ry="4"
            transform="rotate(20 62 31)"
            fill="url(#brainHighlight)"
          />
        </g>
      </svg>
    </div>
  );
};
