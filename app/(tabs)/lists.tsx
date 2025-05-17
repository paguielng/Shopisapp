import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Router, useRouter } from 'expo-router';
import { Plus, Search, Filter } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ShoppingListCard } from '@/components/ShoppingListCard';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';

// Mock data - would come from the backend in a real app
const mockLists = [
  { 
    id: '1', 
    name: 'Weekly Groceries', 
    itemCount: 12, 
    completedCount: 5, 
    totalBudget: 85.50, 
    spentAmount: 35.20,
    icon: 'grocery',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  { 
    id: '2', 
    name: 'Party Supplies', 
    itemCount: 8, 
    completedCount: 0, 
    totalBudget: 120.00, 
    spentAmount: 0,
    icon: 'party',
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  },
  { 
    id: '3', 
    name: 'Office Supplies', 
    itemCount: 5, 
    completedCount: 3, 
    totalBudget: 50.00, 
    spentAmount: 30.45,
    icon: 'other',
    createdAt: new Date(Date.now() - 259200000) // 3 days ago
  },
  { 
    id: '4', 
    name: 'Home Improvement', 
    itemCount: 15, 
    completedCount: 10, 
    totalBudget: 250.00, 
    spentAmount: 175.60,
    icon: 'household',
    createdAt: new Date(Date.now() - 604800000) // 7 days ago
  },
  { 
    id: '5', 
    name: 'Electronics', 
    itemCount: 3, 
    completedCount: 1, 
    totalBudget: 500.00, 
    spentAmount: 199.99,
    icon: 'electronics',
    createdAt: new Date(Date.now() - 1209600000) // 14 days ago
  },
];

export default function ListsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingLists, setShoppingLists] = useState(mockLists);
  const [filteredLists, setFilteredLists] = useState(mockLists);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = shoppingLists.filter(list => 
        list.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLists(filtered);
    } else {
      setFilteredLists(shoppingLists);
    }
  };

  const handleCreateList = () => {
    router.push('/lists/create');
  };

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
        
        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ShoppingListCard 
              list={item} 
              onPress={() => router.push(`/lists/${item.id}`)} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No shopping lists found</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateList}
              >
                <Text style={styles.createButtonText}>Create a new list</Text>
              </TouchableOpacity>
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