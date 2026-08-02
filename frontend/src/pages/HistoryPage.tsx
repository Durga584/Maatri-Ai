import React, { useEffect, useState } from 'react';
import { historyService } from '../services/historyService';
import { AssessmentRecord } from '../types';
import { useToast } from '../contexts/ToastContext';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryDetailModal } from '../components/history/HistoryDetailModal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { History, Download, RefreshCw } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await historyService.getHistory();
      setRecords(res.records);
    } catch (err) {
      showToast('Error Loading History', 'Could not fetch records from SQLite.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewDetails = (record: AssessmentRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await historyService.deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast('Record Deleted', `Assessment #${id} removed from SQLite database.`, 'success');
    } catch (err) {
      showToast('Delete Failed', `Could not delete record #${id}`, 'error');
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Age', 'SystolicBP', 'DiastolicBP', 'BS', 'BodyTemp', 'HeartRate', 'RiskLevel', 'Confidence'];
    const rows = records.map((r) => [r.id, r.timestamp, r.age, r.systolic_bp, r.diastolic_bp, r.bs, r.body_temp, r.heart_rate, r.risk_level, r.confidence]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Maatri_Assessment_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Downloaded', 'Assessment history exported to CSV file.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-primary-600" />
            Prediction History Database
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Persisted maternal assessment records stored in SQLite database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchHistory} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh Table
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <Loader text="Fetching assessment logs from SQLite database..." />
        </Card>
      ) : (
        <HistoryTable records={records} onViewDetails={handleViewDetails} onDelete={handleDelete} />
      )}

      <HistoryDetailModal
        record={selectedRecord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
