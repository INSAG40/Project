import React from 'react';
import { User as UserType } from '../types/auth';
import { TransactionAnalysis } from './TransactionAnalysis';
import { SidePanel } from './SidePanel';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
  setCurrentPage: (page: 'dashboard' | 'transactions' | 'settings' | 'accounts' | 'reports' | 'stream', filter?: 'all' | 'normal' | 'suspicious' | 'flagged') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, setCurrentPage }) => {
  const handlePanelSelect = (option: string) => {
    if (option === 'transactions') {
      setCurrentPage('transactions');
    } else if (option === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (option === 'settings') {
      setCurrentPage('settings');
    } else if (option === 'accounts') {
      setCurrentPage('accounts');
    } else if (option === 'reports') {
      setCurrentPage('reports');
    } else if (option === 'stream') {
      setCurrentPage('stream');
    }
    // Add more navigation as needed
  };

  return (
    <div className="min-h-screen bg-green-50 overflow-x-hidden">
      <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="dashboard" />
      <main className="ml-72 px-4 sm:px-10 py-8 flex flex-col items-start min-h-screen overflow-x-hidden">
        <TransactionAnalysis setCurrentPage={setCurrentPage} />
      </main>
    </div>
  );
};