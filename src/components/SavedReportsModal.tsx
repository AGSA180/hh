import React, { useState, useRef } from 'react';
import { SavedReport, ReportType } from '../types';
import {
  X,
  Archive,
  Search,
  PlusCircle,
  Printer,
  FileDown,
  Trash2,
  Copy,
  ExternalLink,
  Upload,
  Download,
  Calendar,
  Layers,
  FileCheck2,
  CalendarRange,
  FileText,
} from 'lucide-react';

interface SavedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedReports: SavedReport[];
  currentReportId?: string;
  onLoadReport: (report: SavedReport) => void;
  onDeleteReport: (id: string) => void;
  onDuplicateReport: (id: string) => void;
  onNewReport: () => void;
  onDirectPrint: (report: SavedReport) => void;
  onDirectPdf: (report: SavedReport) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
}

export const SavedReportsModal: React.FC<SavedReportsModalProps> = ({
  isOpen,
  onClose,
  savedReports,
  currentReportId,
  onLoadReport,
  onDeleteReport,
  onDuplicateReport,
  onNewReport,
  onDirectPrint,
  onDirectPdf,
  onExportBackup,
  onImportBackup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredReports = savedReports.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.targetDomain && rep.targetDomain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rep.dateString.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    return rep.reportType === filterType;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportBackup(text);
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getReportTypeBadge = (type: ReportType, targetDomain?: string) => {
    if (type === 'item') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
          <FileCheck2 className="w-3 h-3" />
          <span>مستقل: {targetDomain || 'بند مخصص'}</span>
        </span>
      );
    }
    if (type === 'weekly') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
          <CalendarRange className="w-3 h-3" />
          <span>أسبوعي شامل (12 بند)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
        <FileText className="w-3 h-3" />
        <span>تقرير يومي</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <Archive className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">سجل وأرشيف التقارير السابقة</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-800 text-emerald-100">
                  {savedReports.length} تقرير
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300">
                جميع التقارير الإدارية والميدانية المحفوظة مع إمكانية التعديل، الطباعة، أو الاسترجاع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onNewReport();
                onClose();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
              title="إنشاء تقرير جديد فارغ"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تقرير جديد</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 sm:px-6 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، أو البند، أو التاريخ..."
              className="w-full pr-9 pl-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition shrink-0 ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              الكل ({savedReports.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('item')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition shrink-0 ${
                filterType === 'item'
                  ? 'bg-blue-800 text-white'
                  : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              مستقل لبند ({savedReports.filter((r) => r.reportType === 'item').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('daily')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition shrink-0 ${
                filterType === 'daily'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              يومي ({savedReports.filter((r) => r.reportType === 'daily').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('weekly')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition shrink-0 ${
                filterType === 'weekly'
                  ? 'bg-amber-800 text-white'
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              أسبوعي ({savedReports.filter((r) => r.reportType === 'weekly').length})
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-2">
          {savedReports.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-sm sm:text-base text-slate-700">لا توجد تقارير محفوظة بعد</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                عند حفظ أي تقرير (يومي، أسبوعي، أو مستقل لبند محدد)، سيتم أرشفته هنا تلقائياً لسهولة الرجوع إليه وطباعته في أي وقت.
              </p>
              <button
                type="button"
                onClick={() => {
                  onNewReport();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-900 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء وحفظ أول تقرير</span>
              </button>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-slate-500">لا توجد نتائج مطابقة لبحثك</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const isCurrent = currentReportId === report.id;
              const soundCount = report.data.observations.filter((o) => o.status === 'سليم').length;
              const actionCount = report.data.observations.filter((o) => o.status === 'يحتاج معالجة').length;

              return (
                <div
                  key={report.id}
                  className={`p-3.5 rounded-lg border transition space-y-2.5 ${
                    isCurrent
                      ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-400'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200'
                  }`}
                >
                  {/* Row 1: Title and Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{report.title}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                          مفتوح الآن في المحرر
                        </span>
                      )}
                    </div>
                    <div>{getReportTypeBadge(report.reportType, report.targetDomain)}</div>
                  </div>

                  {/* Row 2: Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {report.dayName} {report.dateString}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {report.observationsCount} بنود ({soundCount} سليم{' '}
                        {actionCount > 0 && <strong className="text-amber-700">| {actionCount} يحتاج معالجة</strong>}
                        )
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-400 mr-auto">
                      آخر تعديل: {new Date(report.updatedAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>

                  {/* Row 3: Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Open / Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          onLoadReport(report);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح وتعديل</span>
                      </button>

                      {/* Direct Print 1-Page */}
                      <button
                        type="button"
                        onClick={() => {
                          onDirectPrint(report);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
                        title="طباعة هذا التقرير مباشرة في صفحة واحدة A4"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-700" />
                        <span>طباعة (صفحة 1)</span>
                      </button>

                      {/* Direct PDF Download */}
                      <button
                        type="button"
                        onClick={() => {
                          onDirectPdf(report);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
                        title="تنزيل كملف PDF رسمي فوري"
                      >
                        <FileDown className="w-3.5 h-3.5 text-slate-700" />
                        <span>PDF</span>
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => onDuplicateReport(report.id)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                        title="إنشاء نسخة مكررة من هذا التقرير"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">نسخ</span>
                      </button>
                    </div>

                    {/* Delete */}
                    <div>
                      {deleteConfirmId === report.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 p-1 rounded border border-rose-200">
                          <span className="text-[11px] text-rose-800 font-bold px-1">تأكيد الحذف؟</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteReport(report.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700"
                          >
                            نعم
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px] hover:bg-slate-300"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(report.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          title="حذف هذا التقرير من الأرشيف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer: Backup / Restore and Close */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportBackup}
              disabled={savedReports.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition disabled:opacity-50"
              title="تنزيل نسخة احتياطية من جميع التقارير بصيغة JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>تصدير نسخة احتياطية</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition"
              title="استيراد تقارير سابقة من ملف JSON"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>استيراد ملف</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition self-end sm:self-auto"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
