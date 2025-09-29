import React, { useState, useCallback, useEffect } from 'react';
import { TransactionAnalysisTable } from './TransactionAnalysisTable';
import { SidePanel } from './SidePanel';
import { User as UserType } from '../types/auth';
import { Search, Filter, Download, Trash2, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = 'http://localhost:8000/api/auth';

interface TransactionsProps {
  user: UserType;
  onLogout: () => void;
  setCurrentPage: (page: 'dashboard' | 'transactions' | 'settings' | 'accounts') => void;
  initialFilter?: 'all' | 'normal' | 'suspicious' | 'flagged';
}

const Transactions: React.FC<TransactionsProps> = ({ user, onLogout, setCurrentPage, initialFilter = 'all' }) => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'suspicious' | 'flagged'>(initialFilter);
  const [showCharts, setShowCharts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update filter when initialFilter prop changes
  useEffect(() => {
    setFilterStatus(initialFilter);
  }, [initialFilter]);

  const handlePanelSelect = (option: string) => {
    if (option === 'dashboard') setCurrentPage('dashboard');
    if (option === 'transactions') setCurrentPage('transactions');
    if (option === 'settings') setCurrentPage('settings');
    if (option === 'accounts') setCurrentPage('accounts');
    // Add more navigation as needed
  };

  const exportAllTransactionsToServer = useCallback(async () => {
    if (!isAuthenticated) {
      alert('You must be logged in to export transactions.');
      return;
    }
    const token = localStorage.getItem('aml_token');
    try {
      const response = await fetch(`${API_BASE_URL}/export-all-transactions-csv/`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'all_transactions_analysis.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log('All transactions exported successfully.');
      } else {
        const errorData = await response.json();
        console.error('Failed to export transactions:', errorData);
        alert(`Failed to export transactions: ${errorData.detail || response.statusText}`);
      }
    } catch (error: any) {
      console.error('Network error during export:', error);
      alert('Network error during export.');
    }
  }, [isAuthenticated]);

  const clearAllTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to clear transactions.');
      return;
    }

    if (window.confirm('Are you sure you want to clear all transactions? This action cannot be undone.')) {
      setError(null);
      const token = localStorage.getItem('aml_token');

      try {
        const response = await fetch(`${API_BASE_URL}/transactions/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          console.log('All transactions cleared successfully.');
          window.location.reload();
        } else {
          const errorData = await response.json();
          setError(errorData.detail || 'Failed to clear transactions.');
          console.error('Failed to clear transactions:', errorData);
        }
      } catch (err: any) {
        setError(err.message || 'Network error while clearing transactions.');
        console.error('Network error clearing transactions:', err);
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-green-50">
      <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="transactions" />
      <main className="ml-72 px-10 py-8 flex flex-col items-center min-h-screen">
        <button
          className="mb-6 self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        {/* Search and Filter Controls */}
        <div className="w-full max-w-7xl mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search transactions, accounts, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    showCharts ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {showCharts ? 'Hide Charts' : 'Show Charts'}
                </button>
                
                <div className="relative">
                  <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="flagged">Flagged</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                
                <button
                  onClick={exportAllTransactionsToServer}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </button>

                <button
                  onClick={clearAllTransactions}
                  disabled={!isAuthenticated}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 rounded-lg text-sm bg-red-100 text-red-800">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-7xl">
          <TransactionAnalysisTable searchTerm={searchTerm} filterStatus={filterStatus} />
        </div>
      </main>
    </div>
  );
};

export default Transactions;
