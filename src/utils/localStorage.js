// Reads and writes app data in localStorage.

const KEYS = {
  TRANSACTIONS: 'fincoach_transactions',
  BUDGETS: 'fincoach_budgets',
  GOALS: 'fincoach_goals',
  SUBSCRIPTIONS: 'fincoach_subscriptions',
  SETTINGS: 'fincoach_settings',
  CUSTOM_CATEGORIES: 'fincoach_custom_categories'
};

// Sample data used on first load when storage is empty
const MOCK_TRANSACTIONS = [
  // Current Month: May 2026
  { id: 't1', title: 'Monthly Salary', amount: 85000, date: '2026-05-01', category: 'Salary', type: 'income' },
  { id: 't2', title: 'Apartment Rent', amount: 18000, date: '2026-05-02', category: 'Rent', type: 'expense' },
  { id: 't3', title: 'Groceries Store', amount: 4500, date: '2026-05-05', category: 'Food', type: 'expense' },
  { id: 't4', title: 'Freelance Design', amount: 15000, date: '2026-05-10', category: 'Salary', type: 'income' },
  { id: 't5', title: 'Electricity & Gas', amount: 3200, date: '2026-05-12', category: 'Bills', type: 'expense' },
  { id: 't6', title: 'Zara Shopping', amount: 6200, date: '2026-05-14', category: 'Shopping', type: 'expense' },
  { id: 't7', title: 'Dinout Restaurant', amount: 4000, date: '2026-05-18', category: 'Food', type: 'expense' },
  { id: 't8', title: 'Uber Commute', amount: 1500, date: '2026-05-20', category: 'Travel', type: 'expense' },
  { id: 't9', title: 'Netflix Premium', amount: 649, date: '2026-05-25', category: 'Bills', type: 'expense' },
  { id: 't10', title: 'Medical Checkup', amount: 2500, date: '2026-05-26', category: 'Health', type: 'expense' },

  // Previous Months: April 2026 (for chart comparisons)
  { id: 't11', title: 'Monthly Salary', amount: 85000, date: '2026-04-01', category: 'Salary', type: 'income' },
  { id: 't12', title: 'Apartment Rent', amount: 18000, date: '2026-04-02', category: 'Rent', type: 'expense' },
  { id: 't13', title: 'Supermarket', amount: 5000, date: '2026-04-04', category: 'Food', type: 'expense' },
  { id: 't14', title: 'Electricity & Gas', amount: 3000, date: '2026-04-11', category: 'Bills', type: 'expense' },
  { id: 't15', title: 'Movie Night & Snacks', amount: 2200, date: '2026-04-15', category: 'Entertainment', type: 'expense' },
  { id: 't16', title: 'New Shoes', amount: 4500, date: '2026-04-18', category: 'Shopping', type: 'expense' },
  { id: 't17', title: 'Train Ticket', amount: 3800, date: '2026-04-20', category: 'Travel', type: 'expense' },
  { id: 't18', title: 'Spotify Family', amount: 179, date: '2026-04-25', category: 'Bills', type: 'expense' },

  // March 2026
  { id: 't19', title: 'Monthly Salary', amount: 85000, date: '2026-03-01', category: 'Salary', type: 'income' },
  { id: 't20', title: 'Apartment Rent', amount: 18000, date: '2026-03-02', category: 'Rent', type: 'expense' },
  { id: 't21', title: 'Organic Foods', amount: 4200, date: '2026-03-05', category: 'Food', type: 'expense' },
  { id: 't22', title: 'Electric Bill', amount: 2800, date: '2026-03-12', category: 'Bills', type: 'expense' },
  { id: 't23', title: 'Concert Ticket', amount: 5000, date: '2026-03-15', category: 'Entertainment', type: 'expense' },
  { id: 't24', title: 'Fuel Refill', amount: 3000, date: '2026-03-20', category: 'Travel', type: 'expense' },

  // February 2026
  { id: 't25', title: 'Monthly Salary', amount: 80000, date: '2026-02-01', category: 'Salary', type: 'income' },
  { id: 't26', title: 'Apartment Rent', amount: 18000, date: '2026-02-02', category: 'Rent', type: 'expense' },
  { id: 't27', title: 'Groceries', amount: 4800, date: '2026-02-06', category: 'Food', type: 'expense' },
  { id: 't28', title: 'Gadgets', amount: 12000, date: '2026-02-14', category: 'Shopping', type: 'expense' },
  { id: 't29', title: 'Water Bill', amount: 1200, date: '2026-02-22', category: 'Bills', type: 'expense' },

  // January 2026
  { id: 't30', title: 'Monthly Salary', amount: 80000, date: '2026-01-01', category: 'Salary', type: 'income' },
  { id: 't31', title: 'Apartment Rent', amount: 18000, date: '2026-01-02', category: 'Rent', type: 'expense' },
  { id: 't32', title: 'Groceries', amount: 4000, date: '2026-01-05', category: 'Food', type: 'expense' },
  { id: 't33', title: 'Flight Booking', amount: 15000, date: '2026-01-12', category: 'Travel', type: 'expense' },
  { id: 't34', title: 'Wifi Setup', amount: 1500, date: '2026-01-18', category: 'Bills', type: 'expense' }
];

const MOCK_BUDGETS = [
  { category: 'Food', limit: 10000 },
  { category: 'Shopping', limit: 5000 },
  { category: 'Travel', limit: 4000 },
  { category: 'Bills', limit: 8000 },
  { category: 'Entertainment', limit: 6000 }
];

const MOCK_GOALS = [
  { id: 'g1', name: 'Buy Premium Laptop', targetAmount: 80000, currentSaved: 35000, targetDate: '2026-12-31' },
  { id: 'g2', name: 'Emergency Fund', targetAmount: 150000, currentSaved: 60000, targetDate: '2027-06-30' },
  { id: 'g3', name: 'Europe Summer Vacation', targetAmount: 200000, currentSaved: 45000, targetDate: '2027-08-15' },
  { id: 'g4', name: 'Higher Education Savings', targetAmount: 500000, currentSaved: 120000, targetDate: '2028-09-01' }
];

const MOCK_SUBSCRIPTIONS = [
  { id: 's1', name: 'Netflix Premium', amount: 649, billingDate: '2026-06-25', frequency: 'monthly' },
  { id: 's2', name: 'Spotify Family Plan', amount: 179, billingDate: '2026-06-18', frequency: 'monthly' },
  { id: 's3', name: 'Gold Gym Membership', amount: 2500, billingDate: '2026-07-01', frequency: 'monthly' },
  { id: 's4', name: 'Broadband Internet', amount: 999, billingDate: '2026-06-10', frequency: 'monthly' },
  { id: 's5', name: 'Amazon Prime', amount: 1499, billingDate: '2026-12-15', frequency: 'yearly' }
];

const DEFAULT_SETTINGS = {
  userName: 'Prajna Gaonkar',
  currency: '₹',
  theme: 'dark',
  monthlySavingsTarget: 25000
};

const DEFAULT_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Rent',
  'Salary',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Other'
];

export const initStorage = () => {
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(MOCK_TRANSACTIONS));
  }
  if (!localStorage.getItem(KEYS.BUDGETS)) {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(MOCK_BUDGETS));
  }
  if (!localStorage.getItem(KEYS.GOALS)) {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(MOCK_GOALS));
  }
  if (!localStorage.getItem(KEYS.SUBSCRIPTIONS)) {
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(MOCK_SUBSCRIPTIONS));
  }
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.CUSTOM_CATEGORIES)) {
    localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
};

export const getData = (key) => {
  initStorage();
  const raw = localStorage.getItem(KEYS[key.toUpperCase()]);
  return raw ? JSON.parse(raw) : null;
};

export const saveData = (key, data) => {
  localStorage.setItem(KEYS[key.toUpperCase()], JSON.stringify(data));
};

export const resetAllData = () => {
  localStorage.clear();
  initStorage();
};
