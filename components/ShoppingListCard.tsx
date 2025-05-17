import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { CategoryIcon } from './CategoryIcon';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface ShoppingListCardProps {
  list: {
    id: string;
    name: string;
    itemCount: number;
    completedCount: number;
    totalBudget: number;
    spentAmount: number;
    icon: string;
    createdAt: Date;
  };
  onPress: () => void;
}

export function ShoppingListCard({ list, onPress }: ShoppingListCardProps) {
  const completionPercentage = list.itemCount > 0
    ? (list.completedCount / list.itemCount) * 100
    : 0;
  
  const budgetPercentage = list.totalBudget > 0
    ? (list.spentAmount / list.totalBudget) * 100
    : 0;

  const getBudgetStatusColor = () => {
    if (budgetPercentage > 100) return COLORS.error;
    if (budgetPercentage > 75) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <CategoryIcon name={list.icon} size={24} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.date}>{formatDistanceToNow(list.createdAt)}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{list.completedCount}/{list.itemCount}</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${completionPercentage}%` }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>Budget</Text>
          <Text style={styles.progressValue}>
            ${list.spentAmount.toFixed(2)} / ${list.totalBudget.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(budgetPercentage, 100)}%`,
                backgroundColor: getBudgetStatusColor(),
              }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.small,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  progressContainer: {
    marginBottom: SPACING.small,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
  },
  progressValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});