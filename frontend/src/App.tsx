import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import AccountManagement from './components/AccountManagement';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated, isLoading, error, login, logout, checkAuthStatus } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'transactions' | 'settings' | 'accounts'>('dashboard');
  const [initialFilter, setInitialFilter] = useState<'all' | 'normal' | 'suspicious' | 'flagged'>('all');

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!isAuthenticated) {
    return <Login onLogin={login} error={error} isLoading={isLoading} />;
  }

  const handlePageChange = (page: 'dashboard' | 'transactions' | 'settings' | 'accounts', filter?: 'all' | 'normal' | 'suspicious' | 'flagged') => {
    setCurrentPage(page);
    if (filter) {
      setInitialFilter(filter);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'dashboard' ? (
        <Dashboard user={user!} onLogout={logout} setCurrentPage={handlePageChange} />
      ) : currentPage === 'transactions' ? (
        <Transactions user={user!} onLogout={logout} setCurrentPage={setCurrentPage} initialFilter={initialFilter} />
      ) : currentPage === 'settings' ? (
        <Settings user={user!} onLogout={logout} setCurrentPage={setCurrentPage} />
      ) : (
        <AccountManagement user={user!} onLogout={logout} setCurrentPage={setCurrentPage} />
      )}
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

//   const handlePageChange = (page, filter?) => {
//     setCurrentPage(page);
//     if (filter) setInitialFilter(filter);
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
