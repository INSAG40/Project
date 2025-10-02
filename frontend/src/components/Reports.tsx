import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SidePanel } from './SidePanel';
import { User as UserType } from '../types/auth';
import { FileText, Plus, Trash2, Download, Eye, Calendar, Filter } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type PageKey = 'dashboard' | 'transactions' | 'settings' | 'accounts' | 'reports';

interface ReportsProps {
  user: UserType;
  onLogout: () => void;
  setCurrentPage: (page: PageKey) => void;
}

interface StoredReportMeta {
  id: string;
  title: string;
  createdAt: string; // ISO string
  type: 'summary' | 'detailed';
  sizeBytes: number;
}

interface StoredReport extends StoredReportMeta {
  content: string; // text content for demo; could be CSV/JSON
}

const LOCAL_STORAGE_KEY = 'aml_reports_v1';
const API_BASE_URL = 'http://localhost:8080/api/auth';

const Reports: React.FC<ReportsProps> = ({ user, onLogout, setCurrentPage }) => {
  const [reports, setReports] = useState<StoredReportMeta[]>([]);
  const [generating, setGenerating] = useState(false);
  const [title, setTitle] = useState('Compliance Report');
  const [type, setType] = useState<'summary' | 'detailed'>('summary');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const handlePanelSelect = (option: string) => {
    if (option === 'dashboard') setCurrentPage('dashboard');
    if (option === 'transactions') setCurrentPage('transactions');
    if (option === 'settings') setCurrentPage('settings');
    if (option === 'accounts') setCurrentPage('accounts');
    if (option === 'reports') setCurrentPage('reports');
  };

  const loadReports = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) {
        setReports([]);
        return;
      }
      const parsed: StoredReport[] = JSON.parse(raw);
      const metas = parsed.map(r => ({ id: r.id, title: r.title, createdAt: r.createdAt, type: r.type, sizeBytes: r.sizeBytes }));
      // newest first
      metas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReports(metas);
    } catch (e) {
      console.error('Failed to load reports from localStorage', e);
      setReports([]);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const saveReport = (report: StoredReport) => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr: StoredReport[] = raw ? JSON.parse(raw) : [];
      const next = [report, ...arr];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      loadReports();
    } catch (e) {
      console.error('Failed to save report', e);
      alert('Failed to save the report locally.');
    }
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const titleFinal = title.trim() || 'Untitled Report';
    // fetch transactions
    const token = localStorage.getItem('aml_token');
    let txns: any[] = [];
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        txns = await res.json();
      } else {
        const err = await res.text();
        console.error('Report fetch transactions failed:', res.status, err);
      }
    } catch (e) {
      console.error('Report fetch transactions error:', e);
    }

    const total = txns.length;
    const flagged = txns.filter((t) => t.status === 'flagged').length;
    const suspicious = txns.filter((t) => t.status === 'suspicious').length;
    const normal = txns.filter((t) => t.status === 'normal').length;
    const sumAmount = txns.reduce((a, t) => a + (Number(t.amount) || 0), 0);

    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`AML Guard ${type === 'summary' ? 'Summary' : 'Detailed'} Report`, 14, 18);
      doc.setFontSize(11);
      doc.text(`Title: ${titleFinal}`, 14, 26);
      doc.text(`Period: ${dateFrom || 'N/A'} to ${dateTo || 'N/A'}`, 14, 32);
      doc.text(`Generated: ${new Date(createdAt).toLocaleString()}`, 14, 38);

      // Summary KPI
      autoTable(doc, {
        startY: 44,
        head: [["Metric", "Value"]],
        body: [
          ["Total Transactions", String(total)],
          ["Flagged", String(flagged)],
          ["Suspicious", String(suspicious)],
          ["Normal", String(normal)],
          ["Total Amount", `$${sumAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
        ],
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      if (type === 'detailed' && txns.length) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 10,
          head: [["ID", "Date", "From", "To", "Amount", "Risk", "Status"]],
          body: txns.slice(0, 500).map((t) => [
            t.id,
            t.date,
            t.from_account,
            t.to_account,
            `$${Number(t.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
            String(t.risk_score ?? ''),
            t.status,
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [16, 185, 129] },
        });
      }

      const pdfBlob = doc.output('blob');
      const sizeBytes = (pdfBlob as Blob).size;
      const reader = new FileReader();
      reader.onloadend = () => {
        const content = String(reader.result);
        const report: StoredReport = { id, title: titleFinal, createdAt, type, sizeBytes, content };
        saveReport(report);
        setGenerating(false);
      };
      reader.onerror = () => {
        setGenerating(false);
        alert('Failed to generate PDF file.');
      };
      reader.readAsDataURL(pdfBlob as Blob);
    } catch (e) {
      console.error('PDF generation error:', e);
      setGenerating(false);
      alert('Failed to generate report. Please ensure dependencies are installed.');
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Delete this report?');
    if (!confirmed) return;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr: StoredReport[] = raw ? JSON.parse(raw) : [];
      const next = arr.filter(r => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      loadReports();
    } catch (e) {
      console.error('Failed to delete report', e);
      alert('Failed to delete the report.');
    }
  };

  const handleDownload = (id: string) => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr: StoredReport[] = raw ? JSON.parse(raw) : [];
      const rep = arr.find(r => r.id === id);
      if (!rep) return;
      let blob: Blob;
      if (rep.content.startsWith('data:application/pdf')) {
        // stored as data URL
        const bin = atob(rep.content.split(',')[1]);
        const buf = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
        blob = new Blob([buf], { type: 'application/pdf' });
      } else {
        blob = new Blob([rep.content], { type: 'application/pdf' });
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${rep.title.replace(/[^a-z0-9-_]+/gi, '_')}_${rep.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download report', e);
      alert('Failed to download the report.');
    }
  };

  const handlePreview = (id: string) => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const arr: StoredReport[] = raw ? JSON.parse(raw) : [];
      const rep = arr.find(r => r.id === id);
      if (!rep) return;
      let url: string;
      if (rep.content.startsWith('data:application/pdf')) {
        url = rep.content;
      } else {
        const blob = new Blob([rep.content], { type: 'application/pdf' });
        url = URL.createObjectURL(blob);
      }
      window.open(url, '_blank');
      if (!rep.content.startsWith('data:application/pdf')) {
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    } catch (e) {
      console.error('Failed to preview report', e);
      alert('Failed to open the report.');
    }
  };

  const filteredReports = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(r => r.title.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));
  }, [reports, filterQuery]);

  const formatBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-green-50 overflow-x-hidden">
      <SidePanel onSelect={handlePanelSelect} user={user} onLogout={onLogout} activePage="reports" />
      <main className="ml-72 px-4 sm:px-8 py-8 flex flex-col items-start min-h-screen w-full overflow-x-hidden">
        <div className="w-full max-w-4xl">
          <div className="mb-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">Reports</h2>
            <p className="text-gray-600 break-words">Generate reports and view previously generated ones</p>
          </div>

          {/* Generator Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Report Generator</h3>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center self-start sm:self-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Monthly Compliance Overview"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="summary">Summary</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="relative">
                    <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="relative">
                    <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter and List */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search reports by title or type..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="text-sm text-gray-500">{reports.length} total</div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p>No reports found. Generate one above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((r) => (
                  <div key={r.id} className="p-4 sm:p-5 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 break-words">{r.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="capitalize inline-block mr-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{r.type}</span>
                          <span>{new Date(r.createdAt).toLocaleString()}</span>
                          <span className="ml-2">• {formatBytes(r.sizeBytes)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handlePreview(r.id)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </button>
                      <button
                        onClick={() => handleDownload(r.id)}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                        title="Download"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;


