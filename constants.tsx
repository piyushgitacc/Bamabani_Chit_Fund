
import React from 'react';
import { Category, PaymentMode, TransactionType } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', icon: '🍔', color: 'bg-orange-500' },
  { id: 'cat-2', name: 'Transport', icon: '🚗', color: 'bg-blue-500' },
  { id: 'cat-3', name: 'Shopping', icon: '🛍️', color: 'bg-pink-500' },
  { id: 'cat-4', name: 'Entertainment', icon: '🎬', color: 'bg-purple-500' },
  { id: 'cat-5', name: 'Health', icon: '💊', color: 'bg-red-500' },
  { id: 'cat-6', name: 'Utilities', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'cat-7', name: 'Salary', icon: '💰', color: 'bg-green-500' },
  { id: 'cat-8', name: 'Investment', icon: '📈', color: 'bg-indigo-500' },
  { id: 'cat-9', name: 'Other', icon: '📦', color: 'bg-gray-500' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
];

export const STORAGE_KEY = 'bambani_chit_fund_v1_data';
