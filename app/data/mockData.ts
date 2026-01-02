export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Friend extends User {
  balance: number; // positive = they owe you, negative = you owe them
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  totalBalance: number;
  createdAt: Date;
  category: 'trip' | 'home' | 'couple' | 'other';
  imageUrl?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: User;
  date: Date;
  category: string;
  group?: Group;
  splitBetween: {
    user: User;
    amount: number;
    paid: boolean;
  }[];
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'expense_added' | 'expense_updated' | 'expense_deleted' | 'payment_made' | 'group_created' | 'friend_added';
  user: User;
  expense?: Expense;
  group?: Group;
  timestamp: Date;
  description: string;
}

export interface Balance {
  friend: User;
  amount: number; // positive = they owe you, negative = you owe them
}

// Mock current user
export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  initials: 'AJ',
};

// Mock friends
export const mockFriends: Friend[] = [
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.w@email.com',
    initials: 'SW',
    balance: 45.50,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    initials: 'MC',
    balance: -23.75,
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@email.com',
    initials: 'ED',
    balance: 0,
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@email.com',
    initials: 'JW',
    balance: 120.00,
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    initials: 'LA',
    balance: -67.25,
  },
  {
    id: '7',
    name: 'Tom Martinez',
    email: 'tom.m@email.com',
    initials: 'TM',
    balance: 15.50,
  },
  {
    id: '8',
    name: 'Rachel Brown',
    email: 'rachel.b@email.com',
    initials: 'RB',
    balance: -8.00,
  },
];

// Mock groups
export const mockGroups: Group[] = [
  {
    id: 'g1',
    name: 'Bali Trip 2024',
    description: 'Two weeks in paradise',
    members: [currentUser, mockFriends[0], mockFriends[1], mockFriends[4]],
    totalBalance: 543.25,
    createdAt: new Date('2024-06-15'),
    category: 'trip',
  },
  {
    id: 'g2',
    name: 'Apartment 4B',
    description: 'Monthly expenses',
    members: [currentUser, mockFriends[2], mockFriends[5]],
    totalBalance: -125.50,
    createdAt: new Date('2023-01-10'),
    category: 'home',
  },
  {
    id: 'g3',
    name: 'Couple Expenses',
    description: 'Sarah & Alex',
    members: [currentUser, mockFriends[0]],
    totalBalance: 78.00,
    createdAt: new Date('2023-03-20'),
    category: 'couple',
  },
  {
    id: 'g4',
    name: 'Weekend Skiing',
    description: 'Whistler trip',
    members: [currentUser, mockFriends[3], mockFriends[6]],
    totalBalance: 0,
    createdAt: new Date('2024-12-01'),
    category: 'trip',
  },
];

// Mock expenses
export const mockExpenses: Expense[] = [
  {
    id: 'e1',
    description: 'Dinner at The Bay Restaurant',
    amount: 156.80,
    currency: 'USD',
    paidBy: currentUser,
    date: new Date('2025-01-01'),
    category: 'Food and drink',
    group: mockGroups[0],
    splitBetween: [
      { user: currentUser, amount: 39.20, paid: true },
      { user: mockFriends[0], amount: 39.20, paid: false },
      { user: mockFriends[1], amount: 39.20, paid: false },
      { user: mockFriends[4], amount: 39.20, paid: false },
    ],
  },
  {
    id: 'e2',
    description: 'Hotel - 3 nights',
    amount: 720.00,
    currency: 'USD',
    paidBy: mockFriends[0],
    date: new Date('2024-12-28'),
    category: 'Accommodation',
    group: mockGroups[0],
    splitBetween: [
      { user: currentUser, amount: 180.00, paid: false },
      { user: mockFriends[0], amount: 180.00, paid: true },
      { user: mockFriends[1], amount: 180.00, paid: false },
      { user: mockFriends[4], amount: 180.00, paid: false },
    ],
  },
  {
    id: 'e3',
    description: 'Groceries - Whole Foods',
    amount: 87.50,
    currency: 'USD',
    paidBy: currentUser,
    date: new Date('2024-12-30'),
    category: 'Food and drink',
    group: mockGroups[1],
    splitBetween: [
      { user: currentUser, amount: 29.17, paid: true },
      { user: mockFriends[2], amount: 29.17, paid: false },
      { user: mockFriends[5], amount: 29.16, paid: false },
    ],
  },
  {
    id: 'e4',
    description: 'Uber to airport',
    amount: 45.00,
    currency: 'USD',
    paidBy: mockFriends[1],
    date: new Date('2024-12-27'),
    category: 'Transportation',
    splitBetween: [
      { user: currentUser, amount: 22.50, paid: false },
      { user: mockFriends[1], amount: 22.50, paid: true },
    ],
  },
  {
    id: 'e5',
    description: 'Electricity bill',
    amount: 156.00,
    currency: 'USD',
    paidBy: mockFriends[2],
    date: new Date('2025-01-02'),
    category: 'Utilities',
    group: mockGroups[1],
    splitBetween: [
      { user: currentUser, amount: 52.00, paid: false },
      { user: mockFriends[2], amount: 52.00, paid: true },
      { user: mockFriends[5], amount: 52.00, paid: false },
    ],
  },
  {
    id: 'e6',
    description: 'Movie tickets',
    amount: 32.00,
    currency: 'USD',
    paidBy: currentUser,
    date: new Date('2024-12-29'),
    category: 'Entertainment',
    group: mockGroups[2],
    splitBetween: [
      { user: currentUser, amount: 16.00, paid: true },
      { user: mockFriends[0], amount: 16.00, paid: false },
    ],
  },
  {
    id: 'e7',
    description: 'Coffee shop',
    amount: 12.50,
    currency: 'USD',
    paidBy: mockFriends[3],
    date: new Date('2024-12-25'),
    category: 'Food and drink',
    splitBetween: [
      { user: currentUser, amount: 6.25, paid: false },
      { user: mockFriends[3], amount: 6.25, paid: true },
    ],
  },
  {
    id: 'e8',
    description: 'Ski lift tickets',
    amount: 240.00,
    currency: 'USD',
    paidBy: currentUser,
    date: new Date('2024-12-02'),
    category: 'Entertainment',
    group: mockGroups[3],
    splitBetween: [
      { user: currentUser, amount: 80.00, paid: true },
      { user: mockFriends[3], amount: 80.00, paid: true },
      { user: mockFriends[6], amount: 80.00, paid: true },
    ],
  },
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'expense_added',
    user: currentUser,
    expense: mockExpenses[0],
    timestamp: new Date('2025-01-01T19:30:00'),
    description: 'added "Dinner at The Bay Restaurant" in Bali Trip 2024',
  },
  {
    id: 'a2',
    type: 'payment_made',
    user: mockFriends[3],
    timestamp: new Date('2025-01-01T14:20:00'),
    description: 'paid you $80.00',
  },
  {
    id: 'a3',
    type: 'expense_added',
    user: mockFriends[2],
    expense: mockExpenses[4],
    timestamp: new Date('2025-01-02T10:15:00'),
    description: 'added "Electricity bill" in Apartment 4B',
  },
  {
    id: 'a4',
    type: 'expense_added',
    user: currentUser,
    expense: mockExpenses[2],
    timestamp: new Date('2024-12-30T16:45:00'),
    description: 'added "Groceries - Whole Foods" in Apartment 4B',
  },
  {
    id: 'a5',
    type: 'expense_added',
    user: currentUser,
    expense: mockExpenses[5],
    timestamp: new Date('2024-12-29T21:00:00'),
    description: 'added "Movie tickets" in Couple Expenses',
  },
  {
    id: 'a6',
    type: 'expense_added',
    user: mockFriends[0],
    expense: mockExpenses[1],
    timestamp: new Date('2024-12-28T09:30:00'),
    description: 'added "Hotel - 3 nights" in Bali Trip 2024',
  },
];

export const expenseCategories = [
  'Food and drink',
  'Shopping',
  'Entertainment',
  'Transportation',
  'Accommodation',
  'Utilities',
  'Healthcare',
  'Sports',
  'Other',
];

export const groupCategories = [
  { value: 'trip', label: 'Trip', icon: '✈️' },
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'couple', label: 'Couple', icon: '❤️' },
  { value: 'other', label: 'Other', icon: '📁' },
];
