import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { ListPlus, DollarSign } from 'lucide-react-native';

export default function CreateListScreen() {
  const router = useRouter();
  const [listName, setListName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('grocery');
  const [budget, setBudget] = useState('');
  const [note, setNote] = useState('');

  const handleCreateList = () => {
    if (!listName.trim()) {
      alert('Please enter a list name');
      return;
    }

    // In a real app, we would save this to a database
    const newList = {
      name: listName,
      category: selectedCategory,
      budget: budget ? parseFloat(budget) : 0,
      note: note,
    };

    console.log('Creating new list:', newList);
    
    // Navigate to the new list (for demo, we'll just go to an existing list)
    router.push('/lists/1');
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
          />

          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateList}
          >
            <ListPlus color="#FFFFFF" size={20} />
            <Text style={styles.createButtonText}>Create List</Text>
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
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    marginLeft: SPACING.small,
  },
});