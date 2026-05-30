
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMode {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  UPI = 'UPI'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO string
  paymentMode: PaymentMode;
  note: string;
}

export interface Budget {
  categoryId: string;
  limit: number;
  month: number; // 0-11
  year: number;
}

export interface UserSettings {
  currency: string;
  darkMode: boolean;
  savingsTarget: number;
}

export interface AppData {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  settings: UserSettings;
}
