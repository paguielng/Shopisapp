import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Check, Trash2, Edit, DollarSign, Minus, Plus } from 'lucide-react-native';

interface ShoppingListItemProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    completed: boolean;
    category: string;
  };
  onToggle: () => void;
  onDelete: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onUpdatePrice: (price: number) => void;
}

export function ShoppingListItem({
  item,
  onToggle,
  onDelete,
  onUpdateQuantity,
  onUpdatePrice,
}: ShoppingListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(item.price.toString());

  const handleSavePrice = () => {
    if (editPrice.trim()) {
      onUpdatePrice(parseFloat(editPrice));
    }
    setIsEditing(false);
  };

  const handleQuantityChange = (increment: boolean) => {
    let newQuantity = item.quantity;
    if (increment) {
      newQuantity += 1;
    } else if (item.quantity > 1) {
      newQuantity -= 1;
    }
    onUpdateQuantity(newQuantity);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <View style={[styles.container, item.completed && styles.completedContainer]}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
        <View style={[styles.checkbox, item.completed && styles.checked]}>
          {item.completed && <Check size={16} color={COLORS.white} />}
        </View>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.itemName, item.completed && styles.completedText]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.categoryLabel}>{item.category}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(false)}
            >
              <Minus size={16} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(true)}
            >
              <Plus size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.priceContainer}>
        {isEditing ? (
          <View style={styles.priceEditContainer}>
            <DollarSign size={16} color={COLORS.text} />
            <TextInput
              style={styles.priceInput}
              value={editPrice}
              onChangeText={setEditPrice}
              keyboardType="numeric"
              autoFocus
              selectTextOnFocus
              onBlur={handleSavePrice}
              onSubmitEditing={handleSavePrice}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <View style={styles.priceRow}>
              <DollarSign size={12} color={COLORS.text} />
              <Text style={styles.priceText}>{item.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.totalText}>${itemTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Trash2 size={18} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.small,
    marginBottom: SPACING.small,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  completedContainer: {
    backgroundColor: COLORS.backgroundLight,
    opacity: 0.8,
  },
  checkboxContainer: {
    marginRight: SPACING.small,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    marginRight: SPACING.small,
  },
  itemName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  priceContainer: {
    marginRight: SPACING.medium,
    minWidth: 60,
    alignItems: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  totalText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  priceEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  priceInput: {
    width: 50,
    height: 30,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  deleteButton: {
    padding: 4,
  },
});