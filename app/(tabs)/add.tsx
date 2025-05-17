import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { CategorySelector } from '@/components/CategorySelector';
import { Mic, Camera, ListPlus } from 'lucide-react-native';

export default function AddScreen() {
  const router = useRouter();
  const [listName, setListName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('grocery');
  const [budget, setBudget] = useState('');

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
    };

    console.log('Creating new list:', newList);
    
    // Navigate to the new list
    router.push('/lists/create');
  };

  const handleVoiceAdd = () => {
    alert('Voice recognition coming soon!');
  };

  const handleScanBarcode = () => {
    alert('Barcode scanning coming soon!');
  };

  return (
    <Screen>
      <Header title="Create New List" />
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

          <Text style={styles.label}>Budget (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            placeholderTextColor={COLORS.textLight}
          />

          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateList}
          >
            <ListPlus color="#FFFFFF" size={20} />
            <Text style={styles.createButtonText}>Create List</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickAddContainer}>
          <Text style={styles.quickAddTitle}>Quick Add</Text>
          
          <View style={styles.quickAddButtons}>
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={handleVoiceAdd}
            >
              <Mic color={COLORS.white} size={24} />
              <Text style={styles.quickAddText}>Voice</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickAddButton, { backgroundColor: COLORS.secondary }]}
              onPress={handleScanBarcode}
            >
              <Camera color={COLORS.white} size={24} />
              <Text style={styles.quickAddText}>Scan</Text>
            </TouchableOpacity>
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
  quickAddContainer: {
    marginTop: SPACING.large,
  },
  quickAddTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.medium,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    backgroundColor: COLORS.accent,
    width: '48%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  quickAddText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginTop: SPACING.small,
  },
});