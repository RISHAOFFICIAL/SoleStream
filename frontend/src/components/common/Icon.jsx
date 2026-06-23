import React from 'react';

const Icon = ({ className = '', style = {}, size = 100 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="mintGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8E6CF" stopOpacity="1" />
          <stop offset="100%" stopColor="#7DCEA0" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M20 60 C 20 40, 40 30, 50 40 S 80 60, 80 40"
        stroke="url(#mintGradientIcon)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Icon;
