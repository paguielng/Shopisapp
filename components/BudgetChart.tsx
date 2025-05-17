import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

interface BudgetChartProps {
  spent: number;
  total: number;
}

export function BudgetChart({ spent, total }: BudgetChartProps) {
  const percentage = Math.min((spent / total) * 100, 100);
  const remaining = total - spent;
  const isOverBudget = spent > total;
  
  // Calculate the angle for the progress arc
  const circumference = 2 * Math.PI * 40; // 40 is the radius
  const progressArc = (percentage / 100) * circumference;
  const remainingArc = circumference - progressArc;

  const getStatusColor = () => {
    if (percentage > 90) return COLORS.error;
    if (percentage > 70) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.backgroundCircle} />
        <View style={[styles.progressCircle, { borderColor: getStatusColor() }]} />
        
        <View style={styles.chartContent}>
          <Text style={styles.percentText}>{Math.round(percentage)}%</Text>
          <Text style={styles.usedText}>used</Text>
        </View>
      </View>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.legendText}>Spent: ${spent.toFixed(2)}</Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: COLORS.lightGray }]} />
          <Text style={styles.legendText}>
            {isOverBudget ? 'Over Budget:' : 'Remaining:'} ${Math.abs(remaining).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backgroundCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: COLORS.lightGray,
  },
  progressCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  chartContent: {
    alignItems: 'center',
  },
  percentText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  usedText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
});