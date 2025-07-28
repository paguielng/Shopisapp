import { useState, useEffect } from 'react';

// Données de démonstration
const mockLists = [
  {
    id: '1',
    name: 'Courses de la semaine',
    category: 'grocery',
    budget: 150,
    created_at: new Date().toISOString(),
    itemCount: 12,
    completedCount: 8,
    totalCost: 89.50,
  },
  {
    id: '2',
    name: 'Produits ménagers',
    category: 'household',
    budget: 50,
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    itemCount: 6,
    completedCount: 3,
    totalCost: 32.75,
  },
  {
    id: '3',
    name: 'Électronique',
    category: 'electronics',
    budget: 200,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    itemCount: 4,
    completedCount: 1,
    totalCost: 45.00,
  },
];

export function useShoppingLists() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      setLists(mockLists);
    } catch (err: any) {
      console.error('Error fetching shopping lists:', err);
      setError(err.message || 'Failed to fetch shopping lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const createList = async (listData: {
    name: string;
    category: string;
    budget?: number;
    note?: string;
  }) => {
    try {
      const newList = {
        id: Date.now().toString(),
        name: listData.name,
        category: listData.category,
        budget: listData.budget || 0,
        created_at: new Date().toISOString(),
        itemCount: 0,
        completedCount: 0,
        totalCost: 0,
        note: listData.note,
      };
      
      setLists(prev => [newList, ...prev]);
      return newList;
    } catch (err: any) {
      console.error('Error creating shopping list:', err);
      throw new Error(err.message || 'Failed to create shopping list');
    }
  };

  const deleteList = async (listId: string) => {
    try {
      setLists(prev => prev.filter(list => list.id !== listId));
    } catch (err: any) {
      console.error('Error deleting shopping list:', err);
      throw new Error(err.message || 'Failed to delete shopping list');
    }
  };

  return {
    lists,
    loading,
    error,
    refetch: fetchLists,
    createList,
    deleteList,
  };
}