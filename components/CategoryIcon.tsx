import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ShoppingBag, Home, Monitor, Shirt, PartyPopper, Package } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface CategoryIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function CategoryIcon({ name, size = 24, color = COLORS.primary }: CategoryIconProps) {
  const getIcon = () => {
    switch (name) {
      case 'grocery':
        return <ShoppingBag size={size} color={color} />;
      case 'household':
        return <Home size={size} color={color} />;
      case 'electronics':
        return <Monitor size={size} color={color} />;
      case 'clothing':
        return <Shirt size={size} color={color} />;
      case 'party':
        return <PartyPopper size={size} color={color} />;
      case 'other':
      default:
        return <Package size={size} color={color} />;
    }
  };

  return getIcon();
}