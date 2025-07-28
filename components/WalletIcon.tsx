import React from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

interface WalletIconProps {
  size?: number;
  color?: string;
}

export function WalletIcon({ size = 22, color = '#000000' }: WalletIconProps) {
  return (
    <Svg width={size} height={size * 0.91} viewBox="0 0 22 20" fill="none">
      {/* Main wallet body */}
      <Path
        d="M2 4C2 2.89543 2.89543 2 4 2H18C19.1046 2 20 2.89543 20 4V6H18V4H4V16H18V14H20V16C20 17.1046 19.1046 18 18 18H4C2.89543 18 2 17.1046 2 16V4Z"
        fill={color}
      />
      
      {/* Card slot/opening */}
      <Path
        d="M18 8C18.5523 8 19 8.44772 19 9V11C19 11.5523 18.5523 12 18 12H16C15.4477 12 15 11.5523 15 11V9C15 8.44772 15.4477 8 16 8H18Z"
        fill={color}
      />
      
      {/* Small circle for card access */}
      <circle cx="16.5" cy="10" r="0.5" fill="white" />
    </Svg>
  );
}