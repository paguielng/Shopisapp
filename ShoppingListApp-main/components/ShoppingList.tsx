import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingBag, Users, Clock, Check, ChevronRight } from 'lucide-react-native';

export interface ListItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  purchased: boolean;
  category: string;
}

export interface ShoppingListData {
  id: string;
  name: string;
  createdAt: string;
  items: ListItem[];
  isShared: boolean;
  budget?: string;
}

interface ShoppingListProps {
  list: ShoppingListData;
}

export function ShoppingList({ list }: ShoppingListProps) {
  const router = useRouter();

  const calculateTotal = () => {
    return list.items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const calculateProgress = () => {
    const purchased = list.items.filter(item => item.purchased).length;
    return `${purchased}/${list.items.length} items`;
  };

  // Format the date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate if the list is completed
  const isCompleted = list.items.length > 0 && 
    list.items.every(item => item.purchased);

  // Navigate to list details
  const goToListDetails = () => {
    // This would navigate to a detail view in a real app
    console.log('Navigate to list details for:', list.id);
    // router.push(`/list/${list.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={goToListDetails}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <ShoppingBag size={24} color="#3B82F6" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{list.name}</Text>
          <View style={styles.metaContainer}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.metaText}>{formatDate(list.createdAt)}</Text>
            {list.isShared && (
              <>
                <View style={styles.metaDot} />
                <Users size={14} color="#64748B" />
                <Text style={styles.metaText}>Shared</Text>
              </>
            )}
          </View>
        </View>
        <ChevronRight size={20} color="#94A3B8" />
      </View>

      <View style={styles.details}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(list.items.filter(i => i.purchased).length / list.items.length) * 100}%`,
                  backgroundColor: isCompleted ? '#10B981' : '#3B82F6'
                }
              ]} 
            />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>{calculateProgress()}</Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Check size={12} color="#FFFFFF" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
          
          {list.budget && (
            <View>
              <Text style={styles.budgetLabel}>Budget</Text>
              <Text style={styles.budgetAmount}>${list.budget}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  details: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
});
