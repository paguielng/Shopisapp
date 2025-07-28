import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, Alert, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ShoppingListItem } from '@/components/ShoppingListItem';
import { Plus, Share2, Trash2, DollarSign } from 'lucide-react-native';
import { useShoppingListDetail } from '@/hooks/useShoppingListDetail';

export default function ShoppingListDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const listId = Array.isArray(id) ? id[0] : id;
  
  const { list, loading, error, refetch, addItem, updateItem, toggleItem, deleteItem } = useShoppingListDetail(listId);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      await addItem({
        name: newItem.trim(),
        quantity: 1,
        price: 0,
        category: 'Other'
      });
      setNewItem('');
      setIsAdding(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleToggleItem = async (itemId: string) => {
    try {
      await toggleItem(itemId);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(itemId);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const handleUpdateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateItem(itemId, { quantity });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdateItemPrice = async (itemId: string, price: number) => {
    try {
      await updateItem(itemId, { price });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality would go here');
  };

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this entire shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, we would delete the list from a database
            Alert.alert('Success', 'List deleted successfully');
            router.back();
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && !list) {
    return (
      <Screen>
        <Header title="Loading..." showBackButton />
        <View style={styles.centered}>
          <Text>Loading shopping list...</Text>
        </View>
      </Screen>
    );
  }

  if (error && !list) {
    return (
      <Screen>
        <Header title="Error" showBackButton />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  if (!list) {
    return (
      <Screen>
        <Header title="Not Found" showBackButton />
        <View style={styles.centered}>
          <Text>Shopping list not found</Text>
        </View>
      </Screen>
    );
  }

  // Filter items based on the showCompleted state
  const displayItems = showCompleted 
    ? list.items 
    : list.items.filter((item: any) => !item.completed);

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
              {list.completedCount}/{list.itemCount} items
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${list.itemCount > 0 ? (list.completedCount / list.itemCount) * 100 : 0}%` }
              ]} 
            />
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost</Text>
            <View style={styles.costContainer}>
              <DollarSign size={16} color={COLORS.primary} />
              <Text style={styles.summaryValue}>${list.totalCost.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.budgetBar}>
            <View 
              style={[
                styles.budgetFill, 
                { 
                  width: `${Math.min((list.totalCost / (list.budget || 1)) * 100, 100)}%`,
                  backgroundColor: list.totalCost > (list.budget || 0) ? COLORS.error : COLORS.success
                }
              ]} 
            />
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Budget</Text>
            <Text style={styles.summaryValue}>${(list.budget || 0).toFixed(2)}</Text>
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
    paddingHorizontal: SPACING.medium,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONTS.medium,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
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