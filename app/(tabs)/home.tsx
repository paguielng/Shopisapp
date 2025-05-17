import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListPlus, ShoppingBag, BarChart4, MicIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ShoppingListCard } from '@/components/ShoppingListCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Screen } from '@/components/Screen';

// Mock data - would come from the backend in a real app
const recentLists = [
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
];

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
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Shopper');

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddList = () => {
    router.push('/lists/create');
  };

  const handleAddVoice = () => {
    // Voice recognition would be implemented here
    alert('Voice recognition feature coming soon!');
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subGreeting}>Let's manage your shopping</Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleAddList}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
              <ListPlus color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickActionText}>New List</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/lists')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary }]}>
              <ShoppingBag color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickActionText}>All Lists</Text>
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
            <Text style={styles.quickActionText}>Voice</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Lists</Text>
          
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
          ) : (
            <>
              {recentLists.map(list => (
                <ShoppingListCard 
                  key={list.id} 
                  list={list} 
                  onPress={() => router.push(`/lists/${list.id}`)} 
                />
              ))}
            </>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          
          <View style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryItem}
                onPress={() => router.push(`/lists/category/${category.id}`)}
              >
                <CategoryIcon name={category.icon} size={32} />
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
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.medium,
  },
  greeting: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textLight,
    marginTop: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.large,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  sectionContainer: {
    marginBottom: SPACING.large,
    paddingHorizontal: SPACING.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.medium,
  },
  loader: {
    marginVertical: SPACING.large,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.small,
    alignItems: 'center',
    marginBottom: SPACING.medium,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryName: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
});
