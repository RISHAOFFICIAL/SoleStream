import React from 'react';

const Logo = ({ className = '', style = {}, size = 300 }) => {
  const width = size;
  const height = (size / 300) * 80;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="mintGradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8E6CF" stopOpacity="1" />
          <stop offset="100%" stopColor="#7DCEA0" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M20 50 C 20 30, 40 20, 50 30 S 80 50, 80 30"
        stroke="url(#mintGradientLogo)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x="95"
        y="52"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        fontSize="36"
        fill="#333333"
      >
        Sole
      </text>
      <text
        x="175"
        y="52"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="100"
        fontSize="36"
        fill="#333333"
      >
        Stream
      </text>
    </svg>
  );
};

export default Logo;
