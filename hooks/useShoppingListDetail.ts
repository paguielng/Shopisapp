import { useState, useEffect } from 'react';

// Données mockées pour les détails d'une liste
const mockListDetails: { [key: string]: any } = {
  '1': {
    id: '1',
    name: 'Courses de la semaine',
    category: 'grocery',
    budget: 150,
    created_at: new Date().toISOString(),
    itemCount: 5,
    completedCount: 2,
    totalCost: 45.75,
    items: [
      {
        id: 'item1',
        name: 'Pommes',
        quantity: 2,
        price: 3.50,
        completed: true,
        category: 'Fruits'
      },
      {
        id: 'item2',
        name: 'Pain',
        quantity: 1,
        price: 2.20,
        completed: true,
        category: 'Boulangerie'
      },
      {
        id: 'item3',
        name: 'Lait',
        quantity: 1,
        price: 1.80,
        completed: false,
        category: 'Produits laitiers'
      },
      {
        id: 'item4',
        name: 'Œufs',
        quantity: 12,
        price: 4.50,
        completed: false,
        category: 'Produits laitiers'
      },
      {
        id: 'item5',
        name: 'Bananes',
        quantity: 6,
        price: 2.75,
        completed: false,
        category: 'Fruits'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Produits ménagers',
    category: 'household',
    budget: 50,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    itemCount: 3,
    completedCount: 1,
    totalCost: 15.50,
    items: [
      {
        id: 'item6',
        name: 'Liquide vaisselle',
        quantity: 1,
        price: 3.20,
        completed: true,
        category: 'Nettoyage'
      },
      {
        id: 'item7',
        name: 'Papier toilette',
        quantity: 8,
        price: 6.80,
        completed: false,
        category: 'Hygiène'
      },
      {
        id: 'item8',
        name: 'Éponges',
        quantity: 3,
        price: 5.50,
        completed: false,
        category: 'Nettoyage'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Électronique',
    category: 'electronics',
    budget: 200,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    itemCount: 2,
    completedCount: 0,
    totalCost: 0,
    items: [
      {
        id: 'item9',
        name: 'Câble USB-C',
        quantity: 1,
        price: 15.99,
        completed: false,
        category: 'Accessoires'
      },
      {
        id: 'item10',
        name: 'Écouteurs',
        quantity: 1,
        price: 45.00,
        completed: false,
        category: 'Audio'
      }
    ]
  }
};

export function useShoppingListDetail(listId: string) {
  const [list, setList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const listDetail = mockListDetails[listId];
      if (listDetail) {
        setList(listDetail);
      } else {
        setError('Liste non trouvée');
      }
    } catch (err: any) {
      console.error('Error fetching list detail:', err);
      setError(err.message || 'Failed to fetch list details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listId) {
      fetchListDetail();
    }
  }, [listId]);

  const addItem = async (itemData: {
    name: string;
    quantity?: number;
    price?: number;
    category?: string;
  }) => {
    try {
      if (!list) return;
      
      const newItem = {
        id: `item_${Date.now()}`,
        name: itemData.name,
        quantity: itemData.quantity || 1,
        price: itemData.price || 0,
        category: itemData.category || 'Other',
        completed: false,
      };
      
      const updatedList = {
        ...list,
        items: [...list.items, newItem],
        itemCount: list.itemCount + 1,
        totalCost: list.totalCost + (newItem.price * newItem.quantity)
      };
      
      setList(updatedList);
      mockListDetails[listId] = updatedList;
    } catch (err: any) {
      console.error('Error adding item:', err);
      throw new Error(err.message || 'Failed to add item');
    }
  };

  const updateItem = async (itemId: string, updates: {
    name?: string;
    quantity?: number;
    price?: number;
    category?: string;
  }) => {
    try {
      if (!list) return;
      
      const updatedItems = list.items.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, ...updates };
        }
        return item;
      });
      
      const totalCost = updatedItems.reduce((sum: number, item: any) => 
        sum + (item.price || 0) * (item.quantity || 1), 0
      );
      
      const updatedList = {
        ...list,
        items: updatedItems,
        totalCost
      };
      
      setList(updatedList);
      mockListDetails[listId] = updatedList;
    } catch (err: any) {
      console.error('Error updating item:', err);
      throw new Error(err.message || 'Failed to update item');
    }
  };

  const toggleItem = async (itemId: string) => {
    try {
      if (!list) return;
      
      const updatedItems = list.items.map((item: any) => {
        if (item.id === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
      
      const completedCount = updatedItems.filter((item: any) => item.completed).length;
      
      const updatedList = {
        ...list,
        items: updatedItems,
        completedCount
      };
      
      setList(updatedList);
      mockListDetails[listId] = updatedList;
    } catch (err: any) {
      console.error('Error toggling item:', err);
      throw new Error(err.message || 'Failed to toggle item');
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      if (!list) return;
      
      const itemToDelete = list.items.find((item: any) => item.id === itemId);
      const updatedItems = list.items.filter((item: any) => item.id !== itemId);
      
      const completedCount = updatedItems.filter((item: any) => item.completed).length;
      const totalCost = updatedItems.reduce((sum: number, item: any) => 
        sum + (item.price || 0) * (item.quantity || 1), 0
      );
      
      const updatedList = {
        ...list,
        items: updatedItems,
        itemCount: list.itemCount - 1,
        completedCount,
        totalCost
      };
      
      setList(updatedList);
      mockListDetails[listId] = updatedList;
    } catch (err: any) {
      console.error('Error deleting item:', err);
      throw new Error(err.message || 'Failed to delete item');
    }
  };

  return {
    list,
    loading,
    error,
    refetch: fetchListDetail,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
  };
}