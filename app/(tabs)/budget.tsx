import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { BarChart, DollarSign, TrendingUp, Wallet } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { BudgetChart } from '@/components/BudgetChart';

// Mock data - would be replaced with real data from a database
const budgetData = {
  monthlyBudget: 500,
  spent: 320.75,
  remaining: 179.25,
  categories: [
    { name: 'Groceries', budget: 250, spent: 180.5 },
    { name: 'Household', budget: 100, spent: 75.25 },
    { name: 'Electronics', budget: 100, spent: 45 },
    { name: 'Other', budget: 50, spent: 20 },
  ],
  recentExpenses: [
    { id: '1', name: 'Weekly Groceries', amount: 85.5, date: '2025-01-15', category: 'Groceries' },
    { id: '2', name: 'Cleaning Supplies', amount: 35.25, date: '2025-01-12', category: 'Household' },
    { id: '3', name: 'Phone Accessories', amount: 45, date: '2025-01-10', category: 'Electronics' },
  ]
};

export default function BudgetScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const getPercentage = (spent: number, total: number) => {
    return ((spent / total) * 100).toFixed(0);
  };

  const getStatusColor = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage < 50) return COLORS.success;
    if (percentage < 80) return COLORS.warning;
    return COLORS.error;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Screen>
      <Header title="Budget Tracker" showBackButton={false} />
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'categories' && styles.activeTab]}
          onPress={() => setActiveTab('categories')}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'overview' && (
          <>
            <View style={styles.budgetSummaryCard}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetTitle}>Monthly Budget</Text>
                <Text style={styles.budgetAmount}>{formatCurrency(budgetData.monthlyBudget)}</Text>
              </View>
              
              <View style={styles.budgetChart}>
                <BudgetChart spent={budgetData.spent} total={budgetData.monthlyBudget} />
              </View>
              
              <View style={styles.budgetDetails}>
                <View style={styles.budgetDetail}>
                  <View style={styles.budgetDetailHeader}>
                    <DollarSign size={16} color={COLORS.primary} />
                    <Text style={styles.budgetDetailTitle}>Spent</Text>
                  </View>
                  <Text style={styles.budgetDetailAmount}>{formatCurrency(budgetData.spent)}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.budgetDetail}>
                  <View style={styles.budgetDetailHeader}>
                    <Wallet size={16} color={COLORS.success} />
                    <Text style={styles.budgetDetailTitle}>Remaining</Text>
                  </View>
                  <Text style={[styles.budgetDetailAmount, { color: COLORS.success }]}>
                    {formatCurrency(budgetData.remaining)}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <TrendingUp size={20} color={COLORS.primary} />
                <Text style={styles.statTitle}>Top Category</Text>
                <Text style={styles.statValue}>Groceries</Text>
              </View>
              
              <View style={styles.statCard}>
                <BarChart size={20} color={COLORS.primary} />
                <Text style={styles.statTitle}>Average Per List</Text>
                <Text style={styles.statValue}>{formatCurrency(budgetData.spent / 3)}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            {budgetData.recentExpenses.map(expense => (
              <View key={expense.id} style={styles.expenseItem}>
                <View>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                  <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'categories' && (
          <>
            <Text style={styles.sectionTitle}>Budget by Category</Text>
            {budgetData.categories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryPercentage}>
                    {getPercentage(category.spent, category.budget)}%
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${getPercentage(category.spent, category.budget)}%`,
                        backgroundColor: getStatusColor(category.spent, category.budget) 
                      }
                    ]} 
                  />
                </View>
                
                <View style={styles.categoryDetails}>
                  <Text style={styles.categorySpent}>
                    Spent: {formatCurrency(category.spent)}
                  </Text>
                  <Text style={styles.categoryBudget}>
                    Budget: {formatCurrency(category.budget)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {activeTab === 'history' && (
          <>
            <Text style={styles.sectionTitle}>Expense History</Text>
            {budgetData.recentExpenses.concat(budgetData.recentExpenses).map((expense, index) => (
              <View key={`${expense.id}-${index}`} style={styles.expenseItem}>
                <View>
                  <Text style={styles.expenseName}>{expense.name}</Text>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                  <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.medium,
    marginVertical: SPACING.medium,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.small,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  activeTabText: {
    color: COLORS.white,
  },
  budgetSummaryCard: {
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
  budgetHeader: {
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  budgetTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
  },
  budgetAmount: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 4,
  },
  budgetChart: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  budgetDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SPACING.medium,
  },
  budgetDetail: {
    flex: 1,
  },
  budgetDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  budgetDetailTitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  budgetDetailAmount: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.medium,
    marginTop: SPACING.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    alignItems: 'center',
    marginBottom: SPACING.medium,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginTop: 4,
  },
  expenseItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  expenseName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
  categoryItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.small,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  categoryPercentage: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  progressContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categorySpent: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  categoryBudget: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});