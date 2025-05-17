import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ShoppingListItem } from '@/components/ShoppingListItem';
import { Plus, Share2, Trash2, DollarSign } from 'lucide-react-native';

// Mock data - would come from a database in a real application
const mockItems = [
  { id: '1', name: 'Milk', quantity: 2, price: 3.99, completed: false, category: 'Dairy' },
  { id: '2', name: 'Bread', quantity: 1, price: 2.49, completed: true, category: 'Bakery' },
  { id: '3', name: 'Eggs', quantity: 1, price: 4.99, completed: false, category: 'Dairy' },
  { id: '4', name: 'Apples', quantity: 5, price: 0.99, completed: false, category: 'Produce' },
  { id: '5', name: 'Chicken Breast', quantity: 1, price: 8.99, completed: false, category: 'Meat' },
  { id: '6', name: 'Pasta', quantity: 2, price: 1.49, completed: true, category: 'Dry Goods' },
  { id: '7', name: 'Tomatoes', quantity: 3, price: 0.79, completed: false, category: 'Produce' },
  { id: '8', name: 'Coffee', quantity: 1, price: 9.99, completed: false, category: 'Beverages' },
];

const mockLists = [
  { 
    id: '1', 
    name: 'Weekly Groceries', 
    items: mockItems,
    totalBudget: 85.50,
    icon: 'grocery',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  { 
    id: '2', 
    name: 'Party Supplies', 
    items: mockItems.slice(0, 3),
    totalBudget: 120.00,
    icon: 'party',
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  },
];

export default function ShoppingListDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [list, setList] = useState<any>(null);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch the list from a database
    const foundList = mockLists.find(l => l.id === id);
    if (foundList) {
      setList(foundList);
    }
  }, [id]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const newItemObj = {
      id: Math.random().toString(),
      name: newItem,
      quantity: 1,
      price: 0,
      completed: false,
      category: 'Other'
    };

    setList({
      ...list,
      items: [...list.items, newItemObj]
    });

    setNewItem('');
    setIsAdding(false);
  };

  const handleToggleItem = (itemId: string) => {
    const updatedItems = list.items.map((item: any) => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    setList({
      ...list,
      items: updatedItems
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = list.items.filter((item: any) => item.id !== itemId);

    setList({
      ...list,
      items: updatedItems
    });
  };

  const handleUpdateItemQuantity = (itemId: string, quantity: number) => {
    const updatedItems = list.items.map((item: any) => 
      item.id === itemId ? { ...item, quantity } : item
    );

    setList({
      ...list,
      items: updatedItems
    });
  };

  const handleUpdateItemPrice = (itemId: string, price: number) => {
    const updatedItems = list.items.map((item: any) => 
      item.id === itemId ? { ...item, price } : item
    );

    setList({
      ...list,
      items: updatedItems
    });
  };

  const calculateTotalCost = () => {
    if (!list?.items?.length) return 0;
    
    return list.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleShare = () => {
    alert('Share functionality would go here');
  };

  const handleDeleteList = () => {
    // In a real app, we would delete the list from a database
    alert('Delete list functionality would go here');
    router.back();
  };

  if (!list) {
    return (
      <Screen>
        <Header title="Loading..." showBackButton />
        <View style={styles.centered}>
          <Text>Loading shopping list...</Text>
        </View>
      </Screen>
    );
  }

  // Filter items based on the showCompleted state
  const displayItems = showCompleted 
    ? list.items 
    : list.items.filter((item: any) => !item.completed);

  // Calculate completed and total counts
  const completedCount = list.items.filter((item: any) => item.completed).length;
  const totalCount = list.items.length;

  return (
    <Screen>
      <Header 
        title={list.name} 
        showBackButton 
        rightContent={
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Share2 size={20} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteList} style={styles.headerButton}>
              <Trash2 size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        }
      />
      <View style={styles.container}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Progress</Text>
            <Text style={styles.summaryValue}>
              {completedCount}/{totalCount} items
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }
              ]} 
            />
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost</Text>
            <View style={styles.costContainer}>
              <DollarSign size={16} color={COLORS.primary} />
              <Text style={styles.summaryValue}>${calculateTotalCost().toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.budgetBar}>
            <View 
              style={[
                styles.budgetFill, 
                { 
                  width: `${Math.min((calculateTotalCost() / list.totalBudget) * 100, 100)}%`,
                  backgroundColor: calculateTotalCost() > list.totalBudget ? COLORS.error : COLORS.success
                }
              ]} 
            />
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Budget</Text>
            <Text style={styles.summaryValue}>${list.totalBudget.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Text style={styles.filterButtonText}>
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {!isAdding ? (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsAdding(true)}
          >
            <Plus size={18} color={COLORS.primary} />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              placeholder="Enter item name"
              value={newItem}
              onChangeText={setNewItem}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddItem}
            />
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={handleAddItem}
            >
              <Plus size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {displayItems.length > 0 ? (
          <FlatList
            data={displayItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ShoppingListItem
                item={item}
                onToggle={() => handleToggleItem(item.id)}
                onDelete={() => handleDeleteItem(item.id)}
                onUpdateQuantity={(quantity) => handleUpdateItemQuantity(item.id, quantity)}
                onUpdatePrice={(price) => handleUpdateItemPrice(item.id, price)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items in this list.</Text>
            <Text style={styles.emptyStateSubtext}>Add an item to get started!</Text>
          </View>
        )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: SPACING.medium,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginVertical: SPACING.medium,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginVertical: SPACING.small,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  budgetBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginVertical: SPACING.small,
  },
  budgetFill: {
    height: '100%',
    borderRadius: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.small,
  },
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundLight,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    marginBottom: SPACING.medium,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: SPACING.small,
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: SPACING.medium,
    height: 44,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SPACING.small,
  },
  addItemButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.extraLarge,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.extraLarge,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
  },
});