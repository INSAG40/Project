import React, { useState } from 'react';
import { SidePanel } from './SidePanel';
import { User as UserType } from '../types/auth';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Shield, 
  ShieldOff, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  MoreVertical,
  Ban,
  Unlock,
  History,
  Download
} from 'lucide-react';

interface AccountManagementProps {
  user: UserType;
  onLogout: () => void;
  setCurrentPage: (page: 'dashboard' | 'transactions' | 'settings' | 'accounts') => void;
}

interface Account {
  id: string;
  accountNumber: string;
  accountHolder: string;
  email: string;
  status: 'active' | 'blocked' | 'suspended';
  riskScore: number;
  lastActivity: string;
  transactionCount: number;
  totalAmount: number;
  blockedDate?: string;
  blockedReason?: string;
}

const AccountManagement: React.FC<AccountManagementProps> = ({ user, onLogout, setCurrentPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked' | 'suspended'>('all');
  const [showBlockedAccounts, setShowBlockedAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handlePanelSelect = (option: string) => {
    if (option === 'dashboard') setCurrentPage('dashboard');
    if (option === 'transactions') setCurrentPage('transactions');
    if (option === 'settings') setCurrentPage('settings');
    if (option === 'accounts') setCurrentPage('accounts');
  };

  // Mock data - replace with real API calls
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      accountNumber: 'ACC-001234',
      accountHolder: 'John Doe',
      email: 'john.doe@email.com',
      status: 'active',
      riskScore: 3,
      lastActivity: '2024-01-15 14:30',
      transactionCount: 45,
      totalAmount: 125000
    },
    {
      id: '2',
      accountNumber: 'ACC-001235',
      accountHolder: 'Jane Smith',
      email: 'jane.smith@email.com',
      status: 'blocked',
      riskScore: 9,
      lastActivity: '2024-01-10 09:15',
      transactionCount: 120,
      totalAmount: 2500000,
      blockedDate: '2024-01-10',
      blockedReason: 'Suspicious transaction patterns detected'
    },
    {
      id: '3',
      accountNumber: 'ACC-001236',
      accountHolder: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      status: 'suspended',
      riskScore: 7,
      lastActivity: '2024-01-12 16:45',
      transactionCount: 78,
      totalAmount: 890000,
      blockedDate: '2024-01-12',
      blockedReason: 'High risk score threshold exceeded'
    },
    {
      id: '4',
      accountNumber: 'ACC-001237',
      accountHolder: 'Sarah Williams',
      email: 'sarah.williams@email.com',
      status: 'active',
      riskScore: 2,
      lastActivity: '2024-01-15 11:20',
      transactionCount: 23,
      totalAmount: 45000
    }
  ]);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || account.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const blockedAccounts = accounts.filter(account => account.status === 'blocked');

  const handleAccountAction = (accountId: string, action: 'block' | 'unblock' | 'suspend') => {
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        switch (action) {
          case 'block':
            return { 
              ...account, 
              status: 'blocked' as const, 
              blockedDate: new Date().toISOString().split('T')[0],
              blockedReason: 'Manually blocked by administrator'
            };
          case 'unblock':
            return { 
              ...account, 
              status: 'active' as const, 
              blockedDate: undefined,
              blockedReason: undefined
            };
          case 'suspend':
            return { 
              ...account, 
              status: 'suspended' as const, 
              blockedDate: new Date().toISOString().split('T')[0],
              blockedReason: 'Account suspended for review'
            };
          default:
            return account;
        }
      }
      return account;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-600 bg-red-100';
    if (score >= 4) return 'text-amber-600 bg-amber-100';
    return 'text-emerald-600 bg-emerald-100';
  };

  return (
    <div className="min-h-screen bg-green-50">
      <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="accounts" />
      <main className="ml-72 px-10 py-8 flex flex-col items-start min-h-screen">
        <div className="w-full max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Management</h2>
            <p className="text-gray-600">Manage customer accounts, view transaction history, and control access</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by account number, holder name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">All Accounts</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowBlockedAccounts(!showBlockedAccounts)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    showBlockedAccounts 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Blocked Accounts
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  onClick={() => alert('Export functionality will be implemented with backend')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Blocked Accounts Section */}
          {showBlockedAccounts && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <Ban className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Blocked Accounts ({blockedAccounts.length})</h3>
              </div>
              
              {blockedAccounts.length > 0 ? (
                <div className="space-y-4">
                  {blockedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900 mr-3">{account.accountHolder}</h4>
                          <span className="text-sm text-gray-600">{account.accountNumber}</span>
                          <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                            {account.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{account.email}</p>
                        <p className="text-sm text-red-600 mt-1">
                          Blocked: {account.blockedDate} - {account.blockedReason}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedAccount(account)}
                          className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAccountAction(account.id, 'unblock')}
                          className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="Unblock Account"
                        >
                          <Unlock className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Ban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>No blocked accounts found</p>
                </div>
              )}
            </div>
          )}

          {/* Accounts Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Accounts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{account.accountHolder}</div>
                          <div className="text-sm text-gray-500">{account.accountNumber}</div>
                          <div className="text-xs text-gray-400">{account.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(account.status)}`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(account.riskScore)}`}>
                          {account.riskScore}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.lastActivity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.transactionCount}</div>
                        <div className="text-xs text-gray-500">${account.totalAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedAccount(account)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert('View transaction history functionality will be implemented')}
                            className="text-emerald-600 hover:text-emerald-700 transition-colors"
                            title="View Transaction History"
                          >
                            <History className="h-4 w-4" />
                          </button>
                          {account.status === 'active' ? (
                            <button
                              onClick={() => handleAccountAction(account.id, 'block')}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Block Account"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAccountAction(account.id, 'unblock')}
                              className="text-emerald-600 hover:text-emerald-700 transition-colors"
                              title="Unblock Account"
                            >
                              <Unlock className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Detail Modal */}
          {selectedAccount && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Account Details: {selectedAccount.accountNumber}
                    </h3>
                    <button
                      onClick={() => setSelectedAccount(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Holder</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedAccount.accountHolder}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedAccount.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedAccount.status)}`}>
                          {selectedAccount.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Risk Score</p>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(selectedAccount.riskScore)}`}>
                          {selectedAccount.riskScore}/10
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Activity</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedAccount.lastActivity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedAccount.transactionCount}</p>
                    </div>
                  </div>
                  {selectedAccount.blockedReason && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-500 mb-2">Blocked Reason</p>
                      <p className="text-sm text-red-800 bg-red-50 p-3 rounded-lg">{selectedAccount.blockedReason}</p>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => alert('Transaction history view will be implemented')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <History className="h-4 w-4 mr-2" />
                      View Transaction History
                    </button>
                    {selectedAccount.status === 'active' ? (
                      <button
                        onClick={() => {
                          handleAccountAction(selectedAccount.id, 'block');
                          setSelectedAccount(null);
                        }}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Block Account
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleAccountAction(selectedAccount.id, 'unblock');
                          setSelectedAccount(null);
                        }}
                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Unblock Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountManagement;
