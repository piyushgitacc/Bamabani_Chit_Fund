
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart as ChartIcon, 
  Settings as SettingsIcon, 
  Wallet,
  BrainCircuit,
  X,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  Transaction, 
  TransactionType, 
  Budget, 
  Category, 
  AppData, 
  UserSettings, 
  PaymentMode 
} from './types';
import { DEFAULT_CATEGORIES, STORAGE_KEY } from './constants';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import AnalyticsView from './components/AnalyticsView';
import BudgetsView from './components/BudgetsView';
import SettingsView from './components/SettingsView';
import TransactionForm from './components/TransactionForm';
import AIInsights from './components/AIInsights';

type Tab = 'dashboard' | 'transactions' | 'budgets' | 'analytics' | 'settings';

const App: React.FC = () => {
  // State
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      transactions: [],
      budgets: [],
      categories: DEFAULT_CATEGORIES,
      settings: {
        currency: '$',
        darkMode: false,
        savingsTarget: 1000
      }
    };
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (data.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  // Actions
  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
    setIsFormOpen(false);
  };

  const updateTransaction = (t: Transaction) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(item => item.id === t.id ? t : item)
    }));
    setEditingTransaction(null);
    setIsFormOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const updateBudget = (b: Budget) => {
    setData(prev => {
      const existingIdx = prev.budgets.findIndex(item => 
        item.categoryId === b.categoryId && item.month === b.month && item.year === b.year
      );
      const newBudgets = [...prev.budgets];
      if (existingIdx >= 0) {
        newBudgets[existingIdx] = b;
      } else {
        newBudgets.push(b);
      }
      return { ...prev, budgets: newBudgets };
    });
  };

  const updateSettings = (s: Partial<UserSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...s }
    }));
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen pb-24 lg:pb-0 lg:pl-64 ${data.settings.darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">Bambani Chit Fund</h1>
          </div>
          <nav className="space-y-2">
            <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
            <NavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<ArrowLeftRight size={20}/>} label="Transactions" />
            <NavItem active={activeTab === 'budgets'} onClick={() => setActiveTab('budgets')} icon={<Wallet size={20}/>} label="Budgets" />
            <NavItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<ChartIcon size={20}/>} label="Analytics" />
            <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={20}/>} label="Settings" />
          </nav>
        </div>
        <div className="mt-auto p-4">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all font-medium border border-indigo-200 dark:border-indigo-800"
          >
            <BrainCircuit size={18} />
            AI Insights
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto p-4 lg:p-8">
        <header className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Bambani Chit Fund</h1>
          </div>
          <button onClick={() => setIsAIModalOpen(true)} className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
            <BrainCircuit size={20} />
          </button>
        </header>

        {activeTab === 'dashboard' && <Dashboard data={data} setActiveTab={setActiveTab} />}
        {activeTab === 'transactions' && (
          <TransactionsView 
            data={data} 
            onEdit={(t) => { setEditingTransaction(t); setIsFormOpen(true); }}
            onDelete={deleteTransaction}
          />
        )}
        {activeTab === 'budgets' && <BudgetsView data={data} onUpdateBudget={updateBudget} />}
        {activeTab === 'analytics' && <AnalyticsView data={data} />}
        {activeTab === 'settings' && <SettingsView data={data} updateSettings={updateSettings} resetData={resetData} />}
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 flex justify-around items-center z-50">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24}/>} label="Home" />
        <MobileNavItem active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={<ArrowLeftRight size={24}/>} label="Trans" />
        <div className="-mt-12">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 active:scale-90 transition-transform"
          >
            <Plus size={32} />
          </button>
        </div>
        <MobileNavItem active={activeTab === 'budgets'} onClick={() => setActiveTab('budgets')} icon={<Wallet size={24}/>} label="Budgets" />
        <MobileNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon size={24}/>} label="Menu" />
      </nav>

      {/* Floating Action Button - Desktop */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="hidden lg:flex fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full items-center justify-center shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Modals */}
      {isFormOpen && (
        <TransactionForm 
          onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
          onSave={editingTransaction ? updateTransaction : addTransaction}
          transaction={editingTransaction}
          categories={data.categories}
          currency={data.settings.currency}
        />
      )}

      {isAIModalOpen && (
        <AIInsights 
          data={data} 
          onClose={() => setIsAIModalOpen(false)} 
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      active 
        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300' 
        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[64px] ${
      active ? 'text-indigo-600' : 'text-gray-400'
    }`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export default App;
