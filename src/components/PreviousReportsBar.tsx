import React from 'react';
import {
  FolderClock,
  PlusCircle,
  CheckCircle2,
  Copy,
  ChevronLeft,
  FileText,
  CalendarRange,
  Layers,
  Sparkles,
  Archive,
} from 'lucide-react';
import { SavedReport, ReportData } from '../types';

interface PreviousReportsBarProps {
  currentReport: ReportData;
  savedReports: SavedReport[];
  onOpenNewReportModal: () => void;
  onOpenArchiveModal: () => void;
  onLoadReport: (report: SavedReport) => void;
  onDuplicateCurrent: () => void;
}

export const PreviousReportsBar: React.FC<PreviousReportsBarProps> = ({
  currentReport,
  savedReports,
  onOpenNewReportModal,
  onOpenArchiveModal,
  onLoadReport,
  onDuplicateCurrent,
}) => {
  // Get recent 4 reports (excluding the active one or showing the active one with indicator)
  const recentReports = savedReports.slice(0, 4);

  return (
    <div className="no-print bg-slate-850 text-white border-b border-slate-700/80 px-3 sm:px-6 py-2 shadow-inner">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Left: Quick Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Primary + New Report Button */}
          <button
            type="button"
            onClick={onOpenNewReportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs transition"
            title="إنشاء تقرير جديد مع الحفظ التلقائي للتقرير الحالي"
          >
            <PlusCircle className="w-4 h-4 text-emerald-100" />
            <span>+ تقرير جديد</span>
          </button>

          {/* All Previous Reports Button */}
          <button
            type="button"
            onClick={onOpenArchiveModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-750 hover:bg-slate-700 text-slate-100 border border-slate-600 text-xs sm:text-sm font-semibold transition"
            title="فتح سجل وأرشيف جميع التقارير السابقة"
          >
            <FolderClock className="w-4 h-4 text-amber-400" />
            <span>التقارير السابقة</span>
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full">
              {savedReports.length}
            </span>
          </button>

          {/* Duplicate Current Button */}
          <button
            type="button"
            onClick={onDuplicateCurrent}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
            title="إنشاء نسخة مكررة جديدة من هذا التقرير لتعديل تاريخه أو بياناته"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>تكرار كتقرير جديد</span>
          </button>
        </div>

        {/* Right: Active Report Indicator & Recent Reports Quick Switcher */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Active status pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate max-w-[170px] sm:max-w-[240px]">
              {currentReport.title || 'التقرير الحالي'}
            </span>
            <span className="text-[10px] text-emerald-400 hidden lg:inline">
              (محفوظ تلقائياً ✓)
            </span>
          </div>

          {/* Quick switcher of recent reports if any exist */}
          {recentReports.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="text-[10px] text-slate-400">سريع:</span>
              {recentReports.map((rep) => {
                const isCurrent = rep.id === currentReport.id;
                return (
                  <button
                    key={rep.id}
                    type="button"
                    onClick={() => !isCurrent && onLoadReport(rep)}
                    disabled={isCurrent}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition truncate max-w-[130px] border ${
                      isCurrent
                        ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700 cursor-default'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                    }`}
                    title={`فتح التقرير: ${rep.title} (${rep.dateString})`}
                  >
                    {rep.targetDomain ? `[${rep.targetDomain}]` : rep.dayName || rep.dateString}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
