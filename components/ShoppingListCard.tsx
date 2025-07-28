import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '@/constants/theme';
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

  const getCompletionStatusColor = () => {
    if (completionPercentage === 100) return COLORS.success;
    if (completionPercentage > 50) return COLORS.primary;
    return COLORS.textLight;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <CategoryIcon name={list.icon} size={28} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.date}>{formatDistanceToNow(list.createdAt)}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {list.completedCount}/{list.itemCount}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>Progression</Text>
          <Text style={[styles.progressValue, { color: getCompletionStatusColor() }]}>
            {Math.round(completionPercentage)}%
          </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${completionPercentage}%`,
                backgroundColor: getCompletionStatusColor(),
              }
            ]} 
          />
        </View>
      </View>
      
      {list.totalBudget > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelContainer}>
            <Text style={styles.progressLabel}>Budget</Text>
            <Text style={[styles.progressValue, { color: getBudgetStatusColor() }]}>
              {list.spentAmount.toFixed(0)}€ / {list.totalBudget.toFixed(0)}€
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
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h6,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  statusBadge: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  progressValue: {
    ...TYPOGRAPHY.label,
    color: COLORS.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.xs,
  },
});