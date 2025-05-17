import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { CategoryIcon } from './CategoryIcon';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'grocery', name: 'Groceries' },
  { id: 'household', name: 'Household' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'party', name: 'Party' },
  { id: 'other', name: 'Other' },
];

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategory === category.id && styles.selectedItem
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <CategoryIcon 
            name={category.id} 
            color={selectedCategory === category.id ? COLORS.white : COLORS.primary} 
          />
          <Text 
            style={[
              styles.categoryName,
              selectedCategory === category.id && styles.selectedName
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.small,
    marginBottom: SPACING.medium,
  },
  categoryItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    marginRight: SPACING.small,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginTop: 4,
  },
  selectedName: {
    color: COLORS.white,
  },
});