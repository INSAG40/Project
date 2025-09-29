import React from 'react';
import { Settings, Users, FileText, HelpCircle, LayoutDashboard } from 'lucide-react';

import { LogOut, User as UserIcon } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface SidePanelProps {
  onSelect: (option: string) => void;
  user: UserType;
  onLogout: () => void;
  activePage?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({ onSelect, user, onLogout, activePage = 'dashboard' }) => {
  return (
  <aside className="fixed top-0 left-0 h-screen w-72 bg-blue-900 text-blue-100 flex flex-col shadow-2xl border-r border-blue-950 z-50">
      {/* Logo & Title */}
      <div className="flex flex-col items-center py-8 border-b border-blue-950">
        <div className="flex items-center mb-2">
          <UserIcon className="h-8 w-8 text-blue-200 mr-2" />
          <span className="text-2xl font-extrabold tracking-wide text-blue-200">AML Guard</span>
        </div>
        <span className="text-xs text-blue-300">Anti-Money Laundering System</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1">
        <button
          className={`flex items-center w-full px-6 py-4 hover:bg-blue-800/50 transition-colors text-lg font-medium border-l-4 ${
            activePage === 'dashboard' 
              ? 'bg-blue-800/30 text-emerald-200 border-emerald-400' 
              : 'text-blue-100 border-transparent hover:border-emerald-400'
          }`}
          onClick={() => onSelect('dashboard')}
        >
          <LayoutDashboard className={`mr-4 h-6 w-6 ${activePage === 'dashboard' ? 'text-emerald-400' : 'text-blue-400'}`} />
          Dashboard
        </button>
        <button
          className={`flex items-center w-full px-6 py-4 hover:bg-blue-800/50 transition-colors text-lg font-medium border-l-4 ${
            activePage === 'transactions' 
              ? 'bg-blue-800/30 text-emerald-200 border-emerald-400' 
              : 'text-blue-100 border-transparent hover:border-emerald-400'
          }`}
          onClick={() => onSelect('transactions')}
        >
          <FileText className={`mr-4 h-6 w-6 ${activePage === 'transactions' ? 'text-emerald-400' : 'text-blue-400'}`} />
          Transactions
        </button>
        <button
          className={`flex items-center w-full px-6 py-4 hover:bg-blue-800/50 transition-colors text-lg font-medium border-l-4 ${
            activePage === 'settings' 
              ? 'bg-blue-800/30 text-emerald-200 border-emerald-400' 
              : 'text-blue-100 border-transparent hover:border-emerald-400'
          }`}
          onClick={() => onSelect('settings')}
        >
          <Settings className={`mr-4 h-6 w-6 ${activePage === 'settings' ? 'text-emerald-400' : 'text-blue-400'}`} />
          Settings
        </button>
        <button
          className={`flex items-center w-full px-6 py-4 hover:bg-blue-800/50 transition-colors text-lg font-medium border-l-4 ${
            activePage === 'accounts' 
              ? 'bg-blue-800/30 text-emerald-200 border-emerald-400' 
              : 'text-blue-100 border-transparent hover:border-emerald-400'
          }`}
          onClick={() => onSelect('accounts')}
        >
          <Users className={`mr-4 h-6 w-6 ${activePage === 'accounts' ? 'text-emerald-400' : 'text-blue-400'}`} />
          Account Management
        </button>
        <button
          className="flex items-center w-full px-6 py-4 hover:bg-blue-800/50 transition-colors text-lg font-medium text-blue-100 border-l-4 border-transparent hover:border-emerald-400"
          onClick={() => onSelect('reports')}
        >
          <FileText className="mr-4 h-6 w-6 text-blue-400" />
          Reports
        </button>
        <button
          className="flex items-center w-full px-6 py-4 hover:bg-blue-800/50 transition-colors text-lg font-medium text-blue-100 border-l-4 border-transparent hover:border-emerald-400"
          onClick={() => onSelect('help')}
        >
          <HelpCircle className="mr-4 h-6 w-6 text-blue-400" />
          Help
        </button>
      </nav>
      {/* User Info - Moved to bottom */}
      <div className="py-4 px-4 border-t border-blue-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <UserIcon className="h-8 w-8 text-blue-400 mr-3 flex-shrink-0" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-sm text-blue-100 truncate">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-blue-300 capitalize truncate">{user.role} • {user.department}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="ml-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
