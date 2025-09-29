import React, { useState, useEffect, useCallback } from 'react';
import { Eye, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const API_BASE_URL = 'http://localhost:8000/api/auth';

interface Transaction {
  id: string;
  date: string;
  from_account: string;
  to_account: string;
  amount: number;
  description: string;
  risk_score: number;
  flags: string[];
  status: 'normal' | 'suspicious' | 'flagged';
}

export const TransactionAnalysisTable: React.FC<{ 
  searchTerm?: string; 
  filterStatus?: string;
}> = ({ searchTerm = '', filterStatus = 'all' }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('aml_token');
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        headers: { 'Authorization': `Token ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(data);
      } else {
        setError(data.detail || 'Failed to fetch transactions.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error while fetching transactions.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.from_account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.to_account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-600 bg-red-100';
    if (score >= 4) return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'text-red-600 bg-red-100';
      case 'suspicious': return 'text-amber-600 bg-amber-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  if (loading) return <div className="p-6 max-w-7xl mx-auto text-center text-gray-700">Loading transactions...</div>;
  if (error) return <div className="p-6 max-w-7xl mx-auto text-center text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From → To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>{transaction.from_account}</div>
                    <div className="text-xs text-gray-500">→ {transaction.to_account}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${transaction.amount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(transaction.risk_score)}`}>
                    {transaction.risk_score}/10
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Transaction Details: {selectedTransaction.id}
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    ${selectedTransaction.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">From Account</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.from_account}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">To Account</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.to_account}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-900">{selectedTransaction.description}</p>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-500">AI Risk Assessment</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(selectedTransaction.risk_score)}`}>
                    {selectedTransaction.risk_score}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${selectedTransaction.risk_score >= 7 ? 'bg-red-500' : selectedTransaction.risk_score >= 4 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${selectedTransaction.risk_score * 10}%` }}
                  ></div>
                </div>
              </div>
              {selectedTransaction.flags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Risk Factors Detected</p>
                  <div className="space-y-2">
                    {selectedTransaction.flags.map((flag, index) => (
                      <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-red-800">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
