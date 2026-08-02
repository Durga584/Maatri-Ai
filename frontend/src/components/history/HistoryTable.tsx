import React, { useState } from 'react';
import { AssessmentRecord, RiskCategory } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Search, Filter, Eye, Trash2, ArrowUpDown } from 'lucide-react';

interface HistoryTableProps {
  records: AssessmentRecord[];
  onViewDetails: (record: AssessmentRecord) => void;
  onDelete: (id: number) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, onViewDetails, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'id' | 'timestamp' | 'risk_level'>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter & Search logic
  const filtered = records.filter((r) => {
    const matchesSearch =
      r.id.toString().includes(searchTerm) ||
      r.timestamp.includes(searchTerm) ||
      r.risk_level.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || r.risk_level.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'id') return sortAsc ? a.id - b.id : b.id - a.id;
    if (sortField === 'timestamp') return sortAsc ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp);
    if (sortField === 'risk_level') return sortAsc ? a.risk_level.localeCompare(b.risk_level) : b.risk_level.localeCompare(a.risk_level);
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search record ID, date, or risk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">Filter: All Risks</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Mid Risk">Mid Risk</option>
            <option value="High Risk">High Risk</option>
          </select>
        </div>
      </div>

      {/* Table Component */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortField('id'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortField('timestamp'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Patient Vitals (Age / BP / BS)</th>
                <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => { setSortField('risk_level'); setSortAsc(!sortAsc); }}>
                  <div className="flex items-center gap-1">
                    <span>Risk Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3">AI Confidence</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No matching assessment records found.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">#{row.id}</td>
                    <td className="px-4 py-3 text-slate-600">{row.timestamp}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      Age {row.age} • BP {row.systolic_bp}/{row.diastolic_bp} • BS {row.bs}
                    </td>
                    <td className="px-4 py-3">
                      <Badge riskLevel={row.risk_level} size="sm" />
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {(row.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewDetails(row)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing page {currentPage} of {totalPages} ({sorted.length} total records)</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
