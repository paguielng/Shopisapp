import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListPlus, ShoppingBag, ChartBar as BarChart4, Mic as MicIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS } from '@/constants/theme';
import { ShoppingListCard } from '@/components/ShoppingListCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Screen } from '@/components/Screen';
import { useShoppingLists } from '@/hooks/useShoppingLists';

const categories = [
  { id: '1', name: 'Groceries', icon: 'grocery' },
  { id: '2', name: 'Household', icon: 'household' },
  { id: '3', name: 'Electronics', icon: 'electronics' },
  { id: '4', name: 'Clothing', icon: 'clothing' },
  { id: '5', name: 'Party', icon: 'party' },
  { id: '6', name: 'Other', icon: 'other' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { lists, loading, error, refetch } = useShoppingLists();
  const [refreshing, setRefreshing] = useState(false);

  const userName = 'Alex';

  const handleAddList = () => {
    router.push('/lists/create');
  };

  const handleAddVoice = () => {
    // Voice recognition would be implemented here
    alert('Voice recognition feature coming soon!');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Get recent lists (last 3)
  const recentLists = lists.slice(0, 3);

  return (
    <Screen>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Bonjour, {userName} 👋</Text>
          <Text style={styles.subGreeting}>Gérons vos courses intelligemment</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleAddList}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
              <ListPlus color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickActionText}>Nouvelle Liste</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/lists')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary }]}>
              <ShoppingBag color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickActionText}>Mes Listes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/budget')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.tertiary }]}>
              <BarChart4 color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickActionText}>Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleAddVoice}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent }]}>
              <MicIcon color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickActionText}>Vocal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Listes Récentes</Text>
            {lists.length > 3 && (
              <TouchableOpacity onPress={() => router.push('/lists')}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text style={styles.loadingText}>Chargement de vos listes...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : recentLists.length > 0 ? (
            <>
              {recentLists.map(list => (
                <ShoppingListCard 
                  key={list.id} 
                  list={{
                    id: list.id,
                    name: list.name,
                    itemCount: list.itemCount,
                    completedCount: list.completedCount,
                    totalBudget: list.budget || 0,
                    spentAmount: list.totalCost,
                    icon: list.category,
                    createdAt: new Date(list.created_at),
                  }}
                  onPress={() => router.push(`/lists/${list.id}`)} 
                />
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>Aucune liste pour le moment</Text>
              <Text style={styles.emptyStateText}>Créez votre première liste de courses</Text>
              <TouchableOpacity style={styles.createFirstListButton} onPress={handleAddList}>
                <Text style={styles.createFirstListText}>Créer ma première liste</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryItem}
                onPress={() => router.push(`/lists/category/${category.id}`)}
              >
                <CategoryIcon name={category.icon} size={28} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subGreeting: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
  },
  quickActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  seeAllText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '10',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '20',
  },
  errorText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  retryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyStateText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  createFirstListButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.medium,
  },
  createFirstListText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});