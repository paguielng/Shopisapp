import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface HomeIconProps {
  size?: number;
  color?: string;
}

export function HomeIcon({ size = 22, color = '#000000' }: HomeIconProps) {
  const height = size * 0.91; // 20px height for 22px width
  
  return (
    <Svg width={size} height={height} viewBox="0 0 22 20" fill="none">
      {/* House base/body */}
      <Path
        d="M3 8V17C3 17.5523 3.44772 18 4 18H18C18.5523 18 19 17.5523 19 17V8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* House roof */}
      <Path
        d="M1 10L11 2L21 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Door */}
      <Path
        d="M9 18V12H13V18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}