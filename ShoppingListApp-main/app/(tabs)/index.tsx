import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingList } from '@/components/ShoppingList';
import { mockLists } from '@/data/mockData';
import { List as ListIcon, Plus, Search } from 'lucide-react-native';

export default function ListsScreen() {
  const router = useRouter();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an API
    const loadData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setLists(mockLists);
        setLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  const navigateToCreate = () => {
    router.push('/create');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ListIcon size={48} color="#3B82F6" />
      <Text style={styles.emptyStateTitle}>No Shopping Lists</Text>
      <Text style={styles.emptyStateDescription}>
        Create your first shopping list to get started
      </Text>
      <TouchableOpacity style={styles.createButton} onPress={navigateToCreate}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.createButtonText}>Create List</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading your shopping lists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Lists</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        renderItem={({ item }) => <ShoppingList list={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          lists.length > 0 ? (
            <Text style={styles.sectionTitle}>My Lists</Text>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={navigateToCreate}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#3B82F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
});