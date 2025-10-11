
import { useState, useEffect } from 'react';
import { Shield, Plus } from 'lucide-react';
import { RuleFormModal } from '../components/RuleFormModal';
import { RuleItem } from '../components/RuleItem';
import { Rule } from './rule';

function App() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: 'High Risk Pattern Detection',
      description: 'Block transactions with unusual patterns',
      category: 'pattern',
      field: 'pattern',
      operator: 'contains',
      value: 'unusual',
      risk_points: 75.0,
      active: true,
    },
    {
      id: '2',
      name: 'Amount Threshold Rule',
      description: 'Flag transactions above $10,000',
      category: 'threshold',
      field: 'amount',
      operator: '>=',
      value: '10000',
      risk_points: 60.0,
      active: true,
    },
    {
      id: '3',
      name: 'Frequency Monitoring',
      description: 'Monitor transaction frequency per account',
      category: 'frequency',
      field: 'frequency',
      operator: '>',
      value: '5',
      risk_points: 45.0,
      active: false,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRule = (newRule: Omit<Rule, 'id' | 'created_at'>) => {
    const rule: Rule = {
      ...newRule,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setRules((prev) => [...prev, rule]);
  };

 

  const handleToggleRule = (id: string, active: boolean) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, active } : rule))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Shield className="text-emerald-600" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Transaction Rules</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <Plus size={20} />
              Add Rule
            </button>
          </div>

          <div className="px-6 py-2">
            {rules.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 text-lg mb-2">No rules configured yet</p>
                <p className="text-gray-400 text-sm">
                  Click "Add Rule" to create your first transaction rule
                </p>
              </div>
            ) : (
              rules.map((rule) => (
                <RuleItem
                  key={rule.id}
                  rule={rule}
                  onToggle={handleToggleRule}
                  onDelete={handleDeleteRule}
                />
              ))
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
              Save Rules
            </button>
          </div>
        </div>
      </div>

      <RuleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRule}
      />
    </div>
  );
}

export default App;



// import React, { useState, useEffect } from 'react';
// import { Login } from './components/Login';
// import { Dashboard } from './components/Dashboard';
// import Transactions from './components/Transactions';
// import Settings from './components/Settings';
// import AccountManagement from './components/AccountManagement';
// import { useAuth } from './hooks/useAuth';

// function App() {
//   const { user, isAuthenticated, isLoading, error, login, logout, checkAuthStatus } = useAuth();
//   const [currentPage, setCurrentPage] = useState<'dashboard' | 'transactions' | 'settings' | 'accounts'>('dashboard');
//   const [initialFilter, setInitialFilter] = useState<'all' | 'normal' | 'suspicious' | 'flagged'>('all');

//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   if (!isAuthenticated) {
//     return <Login onLogin={login} error={error} isLoading={isLoading} />;
//   }

//   const handlePageChange = (page: 'dashboard' | 'transactions' | 'settings' | 'accounts', filter?: 'all' | 'normal' | 'suspicious' | 'flagged') => {
//     setCurrentPage(page);
//     if (filter) {
//       setInitialFilter(filter);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {currentPage === 'dashboard' ? (
//         <Dashboard user={user!} onLogout={logout} setCurrentPage={handlePageChange} />
//       ) : currentPage === 'transactions' ? (
//         <Transactions user={user!} onLogout={logout} setCurrentPage={setCurrentPage} initialFilter={initialFilter} />
//       ) : currentPage === 'settings' ? (
//         <Settings user={user!} onLogout={logout} setCurrentPage={setCurrentPage} />
//       ) : (
//         <AccountManagement user={user!} onLogout={logout} setCurrentPage={setCurrentPage} />
//       )}
//     </div>
//   );
// }

// export default App;

