import { ShoppingListData } from '@/components/ShoppingList';

export const mockLists: ShoppingListData[] = [
  {
    id: '1',
    name: 'Weekly Groceries',
    createdAt: '2025-05-10T12:00:00Z',
    isShared: true,
    budget: '120.00',
    items: [
      {
        id: '101',
        name: 'Milk',
        quantity: '2',
        price: '3.99',
        purchased: true,
        category: 'Dairy'
      },
      {
        id: '102',
        name: 'Bread',
        quantity: '1',
        price: '2.49',
        purchased: true,
        category: 'Bakery'
      },
      {
        id: '103',
        name: 'Eggs',
        quantity: '1',
        price: '4.99',
        purchased: true,
        category: 'Dairy'
      },
      {
        id: '104',
        name: 'Apples',
        quantity: '6',
        price: '0.75',
        purchased: false,
        category: 'Produce'
      },
      {
        id: '105',
        name: 'Chicken Breast',
        quantity: '2',
        price: '8.99',
        purchased: false,
        category: 'Meat'
      }
    ]
  },
  {
    id: '2',
    name: 'Office Supplies',
    createdAt: '2025-05-08T09:30:00Z',
    isShared: false,
    items: [
      {
        id: '201',
        name: 'Notebooks',
        quantity: '3',
        price: '4.99',
        purchased: true,
        category: 'Supplies'
      },
      {
        id: '202',
        name: 'Pens (box)',
        quantity: '1',
        price: '8.99',
        purchased: true,
        category: 'Supplies'
      },
      {
        id: '203',
        name: 'Stapler',
        quantity: '1',
        price: '12.99',
        purchased: false,
        category: 'Supplies'
      }
    ]
  },
  {
    id: '3',
    name: 'Party Supplies',
    createdAt: '2025-05-15T14:00:00Z',
    isShared: true,
    budget: '200.00',
    items: [
      {
        id: '301',
        name: 'Paper Plates',
        quantity: '2',
        price: '5.99',
        purchased: true,
        category: 'Supplies'
      },
      {
        id: '302',
        name: 'Napkins',
        quantity: '1',
        price: '3.99',
        purchased: true,
        category: 'Supplies'
      },
      {
        id: '303',
        name: 'Plastic Cups',
        quantity: '1',
        price: '4.99',
        purchased: true,
        category: 'Supplies'
      },
      {
        id: '304',
        name: 'Decorations',
        quantity: '1',
        price: '24.99',
        purchased: true,
        category: 'Decor'
      },
      {
        id: '305',
        name: 'Cake',
        quantity: '1',
        price: '32.99',
        purchased: true,
        category: 'Food'
      }
    ]
  },
  {
    id: '4',
    name: 'Weekend DIY Project',
    createdAt: '2025-05-05T11:15:00Z',
    isShared: false,
    budget: '150.00',
    items: [
      {
        id: '401',
        name: 'Paint',
        quantity: '2',
        price: '24.99',
        purchased: true,
        category: 'Materials'
      },
      {
        id: '402',
        name: 'Brushes',
        quantity: '3',
        price: '5.99',
        purchased: true,
        category: 'Tools'
      },
      {
        id: '403',
        name: 'Sandpaper',
        quantity: '1',
        price: '7.99',
        purchased: false,
        category: 'Materials'
      },
      {
        id: '404',
        name: 'Drop Cloth',
        quantity: '1',
        price: '12.99',
        purchased: false,
        category: 'Materials'
      }
    ]
  }
];
