import React, { useEffect, useRef, useState } from 'react';
import { SidePanel } from './SidePanel';
import { User as UserType } from '../types/auth';
import { Radio, RefreshCw, Activity, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/auth';

type PageKey = 'dashboard' | 'transactions' | 'settings' | 'accounts' | 'reports' | 'stream';

interface StreamProps {
  user: UserType;
  onLogout: () => void;
  setCurrentPage: (page: PageKey) => void;
}

interface MarbleEvent {
  id?: string;
  type?: string;
  timestamp?: string;
  payload?: any;
}

const Stream: React.FC<StreamProps> = ({ user, onLogout, setCurrentPage }) => {
  const [events, setEvents] = useState<MarbleEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [since, setSince] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const handlePanelSelect = (option: string) => {
    if (option === 'dashboard') setCurrentPage('dashboard');
    if (option === 'transactions') setCurrentPage('transactions');
    if (option === 'settings') setCurrentPage('settings');
    if (option === 'accounts') setCurrentPage('accounts');
    if (option === 'reports') setCurrentPage('reports');
    if (option === 'stream') setCurrentPage('stream');
  };

  const fetchEvents = async () => {
    setLoading(true);
    const token = localStorage.getItem('aml_token');
    try {
      const qs = since ? `?since=${encodeURIComponent(since)}` : '';
      const res = await fetch(`${API_BASE_URL}/marble/events/${qs}`, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items: MarbleEvent[] = Array.isArray(data) ? data : (data.events || []);
      if (since && events.length) {
        // append new items
        const existingIds = new Set(events.map((e) => e.id));
        const newOnes = items.filter((e) => !existingIds.has(e.id));
        setEvents((prev) => [...prev, ...newOnes]);
      } else {
        setEvents(items);
      }
      const latestTs = (items.length ? items : events).reduce<string | null>((acc, ev) => {
        const ts = ev.timestamp || '';
        if (!ts) return acc;
        if (!acc) return ts;
        return new Date(ts) > new Date(acc) ? ts : acc;
      }, since);
      if (latestTs) setSince(latestTs);
    } catch (e) {
      console.error('Failed to fetch events', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    intervalRef.current = window.setInterval(fetchEvents, 5000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-green-50 overflow-x-hidden">
      <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="stream" />
      <main className="ml-72 px-4 sm:px-8 py-8 flex flex-col items-start min-h-screen overflow-x-hidden w-full">
        <div className="w-full max-w-4xl">
          <div className="mb-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words flex items-center">
              <Radio className="h-6 w-6 text-emerald-600 mr-3" /> Live Transaction Stream
            </h2>
            <p className="text-gray-600 break-words">Connected to Marble via backend proxy. Auto-refreshes every 5s.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 text-emerald-600 mr-2" />
                {events.length} events
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchEvents}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </button>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem('aml_token');
                    await fetch(`${API_BASE_URL}/marble/clear-demo/`, {
                      method: 'DELETE',
                      headers: { 'Authorization': `Token ${token}` },
                    });
                    setEvents([]);
                    setSince(null);
                  }}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" /> Clear
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-600">Loading...</div>
            ) : events.length === 0 ? (
              <div className="text-gray-500 py-8 text-center">
                <AlertTriangle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                No events yet
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((ev, idx) => {
                  const ts = ev.timestamp ? new Date(ev.timestamp).toLocaleString() : '';
                  const type = (ev.type || '').toLowerCase();
                  const p = ev.payload || {};
                  const isTxn = type === 'transaction_scored' || (p && 'transactionId' in p && 'score' in p);

                  const risk = (p.risk || '').toLowerCase();
                  const score = typeof p.score === 'number' ? p.score : undefined;
                  const riskColor = risk === 'high' ? 'bg-red-100 text-red-800' : risk === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800';
                  const scoreColor = score !== undefined ? (score >= 0.8 ? 'text-red-700' : score >= 0.5 ? 'text-amber-700' : 'text-emerald-700') : 'text-gray-700';
                  const amount = typeof p.amount === 'number' ? p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.amount;

                  return (
                    <div key={ev.id || idx} className="p-4 rounded border border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900 capitalize">{ev.type || 'event'}</div>
                        <div className="text-xs text-gray-500">{ts}</div>
                      </div>

                      {isTxn ? (
                        <div className="mt-3">
                          <div className="flex items-center flex-wrap gap-2 text-sm">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${riskColor}`}>Risk: {p.risk ?? 'n/a'}</span>
                            {score !== undefined && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 ${scoreColor}`}>Score: {score}</span>
                            )}
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div className="bg-white rounded border p-3">
                              <div className="text-gray-500">Transaction ID</div>
                              <div className="font-medium text-gray-900 break-words">{p.transactionId || '-'}</div>
                            </div>
                            <div className="bg-white rounded border p-3">
                              <div className="text-gray-500">Amount</div>
                              <div className="font-medium text-gray-900">{amount} {p.currency || ''}</div>
                            </div>
                            <div className="bg-white rounded border p-3">
                              <div className="text-gray-500">From → To</div>
                              <div className="font-medium text-gray-900 break-words">{p.from || '-'} → {p.to || '-'}</div>
                            </div>
                          </div>
                          <details className="mt-3">
                            <summary className="text-xs text-gray-600 cursor-pointer">Raw payload</summary>
                            <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap break-words">{JSON.stringify(p, null, 2)}</pre>
                          </details>
                        </div>
                      ) : (
                        <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap break-words">{JSON.stringify(ev.payload ?? ev, null, 2)}</pre>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Demo controls when real stream is empty */}
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Demo Events</h4>
            <p className="text-sm text-gray-600 mb-3">If Marble has no events, use this to add sample events.</p>
            <button
              onClick={async () => {
                const token = localStorage.getItem('aml_token');
                await fetch(`${API_BASE_URL}/marble/demo-generate/`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ score: Math.random().toFixed(2) }),
                });
                fetchEvents();
              }}
              className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Generate Demo Event
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stream;


