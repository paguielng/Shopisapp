import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search, Filter } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ShoppingListCard } from '@/components/ShoppingListCard';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { useShoppingLists } from '@/hooks/useShoppingLists';

export default function ListsScreen() {
  const router = useRouter();
  const { lists, loading, error, refetch } = useShoppingLists();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCreateList = () => {
    router.push('/lists/create');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Filter lists based on search query
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderListItem = ({ item }: { item: any }) => (
    <ShoppingListCard 
      list={{
        id: item.id,
        name: item.name,
        itemCount: item.itemCount,
        completedCount: item.completedCount,
        totalBudget: item.budget || 0,
        spentAmount: item.totalCost,
        icon: item.category,
        createdAt: new Date(item.created_at),
      }}
      onPress={() => router.push(`/lists/${item.id}`)} 
    />
  );

  return (
    <Screen>
      <Header title="Shopping Lists" showBackButton={false} />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={COLORS.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search lists..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              {loading ? (
                <Text style={styles.emptyStateText}>Loading your lists...</Text>
              ) : searchQuery ? (
                <Text style={styles.emptyStateText}>No lists found matching "{searchQuery}"</Text>
              ) : (
                <>
                  <Text style={styles.emptyStateText}>No shopping lists found</Text>
                  <TouchableOpacity 
                    style={styles.createButton}
                    onPress={handleCreateList}
                  >
                    <Text style={styles.createButtonText}>Create a new list</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
        />
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleCreateList}
        >
          <Plus color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    marginVertical: SPACING.medium,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    height: 44,
  },
  searchIcon: {
    marginRight: SPACING.small,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginLeft: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '15',
    padding: SPACING.medium,
    borderRadius: 8,
    marginBottom: SPACING.medium,
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONTS.medium,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: 6,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80, // Space for the FAB
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.extraLarge,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: 20,
  },
  createButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});