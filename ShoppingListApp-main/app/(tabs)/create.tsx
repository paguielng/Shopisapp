import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';

export default function CreateListScreen() {
  const router = useRouter();
  const [listName, setListName] = useState('');
  const [budget, setBudget] = useState('');
  const [items, setItems] = useState([
    { id: '1', name: '', quantity: '1', price: '', category: 'General' }
  ]);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '1',
      price: '',
      category: 'General'
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleCreateList = () => {
    // In a real app, this would save the list to an API
    console.log('Creating list:', { name: listName, budget, items });
    router.push('/');
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const isFormValid = () => {
    if (!listName.trim()) return false;
    
    // Check if at least one item has a name
    const hasNamedItem = items.some(item => item.name.trim() !== '');
    return hasNamedItem;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Create List</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>List Name</Text>
          <TextInput
            style={styles.input}
            value={listName}
            onChangeText={setListName}
            placeholder="e.g., Weekly Groceries"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Budget (Optional)</Text>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor="#94A3B8"
          />

          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>Items</Text>
            <TouchableOpacity onPress={addItem} style={styles.addButton}>
              <Plus size={20} color="#3B82F6" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, index) => (
            <View key={item.id} style={styles.itemContainer}>
              <Text style={styles.itemIndexLabel}>Item {index + 1}</Text>
              
              <TextInput
                style={styles.itemNameInput}
                value={item.name}
                onChangeText={(value) => updateItem(item.id, 'name', value)}
                placeholder="Item name"
                placeholderTextColor="#94A3B8"
              />
              
              <View style={styles.itemDetailsRow}>
                <View style={styles.quantityContainer}>
                  <Text style={styles.itemDetailLabel}>Qty</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={item.quantity}
                    onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                    keyboardType="number-pad"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.itemDetailLabel}>Price</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={item.price}
                    onChangeText={(value) => updateItem(item.id, 'price', value)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <TouchableOpacity 
                  onPress={() => removeItem(item.id)} 
                  style={styles.deleteButton}
                  disabled={items.length === 1}
                >
                  <Trash2 size={20} color={items.length === 1 ? '#CBD5E1' : '#EF4444'} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Estimated Total:</Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.createButton, !isFormValid() && styles.createButtonDisabled]}
          onPress={handleCreateList}
          disabled={!isFormValid()}
        >
          <Text style={styles.createButtonText}>Create Shopping List</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemIndexLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  itemNameInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  itemDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    flex: 2,
    marginRight: 8,
  },
  itemDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  deleteButton: {
    padding: 12,
    marginTop: 24,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});