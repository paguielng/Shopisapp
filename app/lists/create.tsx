import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { ListPlus, DollarSign } from 'lucide-react-native';
import { useShoppingLists } from '@/hooks/useShoppingLists';

export default function CreateListScreen() {
  const router = useRouter();
  const { createList } = useShoppingLists();
  const [listName, setListName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('grocery');
  const [budget, setBudget] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateList = async () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    try {
      setLoading(true);
      const newList = await createList({
        name: listName.trim(),
        category: selectedCategory,
        budget: budget ? parseFloat(budget) : 0,
        note: note.trim() || undefined,
      });

      // Navigate to the new list
      router.replace(`/lists/${newList.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="Create New List" showBackButton />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>List Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Weekly Groceries"
            value={listName}
            onChangeText={setListName}
            placeholderTextColor={COLORS.textLight}
            editable={!loading}
          />

          <Text style={styles.label}>Category</Text>
          <CategorySelector 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <Text style={styles.label}>Budget</Text>
          <View style={styles.budgetInputContainer}>
            <DollarSign size={20} color={COLORS.textLight} style={styles.dollarSign} />
            <TextInput
              style={styles.budgetInput}
              placeholder="0.00"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textLight}
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note about this shopping list"
            value={note}
            onChangeText={setNote}
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreateList}
            disabled={loading}
          >
            <ListPlus color="#FFFFFF" size={20} />
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create List'}
            </Text>
          </TouchableOpacity>
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
  contentContainer: {
    padding: SPACING.medium,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: SPACING.small,
    marginBottom: SPACING.medium,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: SPACING.small,
    marginBottom: SPACING.medium,
  },
  dollarSign: {
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.small,
    marginBottom: SPACING.medium,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    minHeight: 100,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
  createButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    marginLeft: SPACING.small,
  },
});