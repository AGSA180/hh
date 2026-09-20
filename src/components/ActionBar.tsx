import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  FileText,
  Eye,
  Edit3,
  RotateCcw,
  Sparkles,
  Save,
  Download,
  Code2,
  FileDown,
  Loader2,
  CalendarRange,
  Archive,
  Layers,
  BookmarkCheck,
} from 'lucide-react';
import { ReportData } from '../types';
import { generateMarkdown, generatePlainText } from '../utils/formatters';

interface ActionBarProps {
  reportData: ReportData;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
  onReset: () => void;
  onLoadSample: () => void;
  onSaveDraft: () => void;
  hasSavedDraft: boolean;
  onLoadDraft: () => void;
  onOpenMarkdownModal: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  onPrint: () => void;
  isPrinting?: boolean;
  onPrintDaily?: () => void;
  onPrintWeekly?: () => void;
  onSwitchToDaily?: () => void;
  onSwitchToWeekly?: () => void;
  onOpenIndependentModal?: () => void;
  onOpenArchiveModal?: () => void;
  onSaveToArchive?: () => void;
  savedReportsCount?: number;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  reportData,
  isReadOnly,
  onToggleReadOnly,
  onReset,
  onLoadSample,
  onSaveDraft,
  hasSavedDraft,
  onLoadDraft,
  onOpenMarkdownModal,
  onExportPdf,
  isExportingPdf,
  onPrint,
  isPrinting = false,
  onPrintDaily,
  onPrintWeekly,
  onSwitchToDaily,
  onSwitchToWeekly,
  onOpenIndependentModal,
  onOpenArchiveModal,
  onSaveToArchive,
  savedReportsCount = 0,
}) => {
  const isWeekly = reportData.reportType === 'weekly';
  const isItem = reportData.reportType === 'item';
  const [copiedType, setCopiedType] = useState<'markdown' | 'text' | null>(null);

  const handleCopyMarkdown = async () => {
    const md = generateMarkdown(reportData);
    try {
      await navigator.clipboard.writeText(md);
      setCopiedType('markdown');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = md;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType('markdown');
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleCopyText = async () => {
    const text = generatePlainText(reportData);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  return (
    <div className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-2 sm:py-2.5 flex flex-col gap-2">
        {/* Main Controls Row: Primary Print & Mode Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: View toggle & Mode tabs */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            {/* Toggle view mode */}
            <button
              type="button"
              onClick={onToggleReadOnly}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold border transition min-h-[38px] ${
                isReadOnly
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {isReadOnly ? (
                <>
                  <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>التحرير</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                  <span>معاينة</span>
                </>
              )}
            </button>

            {/* Daily vs Weekly Mode Switcher Tabs */}
            {onSwitchToDaily && onSwitchToWeekly && (
              <div className="inline-flex p-0.5 rounded-md bg-slate-100 border border-slate-300 min-h-[38px] items-center">
                <button
                  type="button"
                  onClick={onSwitchToDaily}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-bold transition flex items-center gap-1 ${
                    !isWeekly && !isItem
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="التحويل إلى وضع كتابة التقرير اليومي"
                >
                  <span>يومي</span>
                </button>
                <button
                  type="button"
                  onClick={onSwitchToWeekly}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-bold transition flex items-center gap-1 ${
                    isWeekly
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  title="التحويل إلى التقرير الأسبوعي الشامل (كافة البنود الـ 12)"
                >
                  <CalendarRange className="w-3 h-3 text-amber-400" />
                  <span>أسبوعي (12)</span>
                </button>
              </div>
            )}

            {/* Independent Item Report Trigger */}
            {onOpenIndependentModal && (
              <button
                type="button"
                onClick={onOpenIndependentModal}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold border transition min-h-[38px] ${
                  isItem
                    ? 'bg-blue-700 text-white border-blue-800 shadow-xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                }`}
                title="إنشاء وكتابة تقرير متابعة مستقل مخصص لبند أو مجال محدد"
              >
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden sm:inline">تقرير مستقل لبند</span>
                <span className="sm:hidden">مستقل</span>
              </button>
            )}
          </div>

          {/* Right: Archive, Print & PDF Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mr-auto">
            {/* Archive Reports Modal Trigger */}
            {onOpenArchiveModal && (
              <button
                type="button"
                onClick={onOpenArchiveModal}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition shadow-xs min-h-[38px]"
                title="فتح أرشيف التقارير المحفوظة واسترجاعها أو طباعتها"
              >
                <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                <span className="hidden xs:inline">أرشيف التقارير</span>
                <span className="xs:hidden">الأرشيف</span>
                {savedReportsCount > 0 && (
                  <span className="bg-amber-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {savedReportsCount}
                  </span>
                )}
              </button>
            )}

            {/* Direct PDF Download */}
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-slate-700 hover:bg-slate-800 text-white transition shadow-xs disabled:opacity-60 disabled:cursor-not-allowed min-h-[38px]"
              title="تصدير وتنزيل ملف PDF رسمي بجودة عالية مباشرة"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
                  <span className="hidden xs:inline">جاري الإنشاء...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-200" />
                  <span>PDF</span>
                </>
              )}
            </button>

            {/* DEDICATED DAILY REPORT PRINT BUTTON */}
            <button
              type="button"
              onClick={onPrintDaily || onPrint}
              disabled={isPrinting}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition shadow-xs active:scale-95 disabled:opacity-60 min-h-[38px]"
              title="طباعة التقرير اليومي الحالي (Ctrl+P)"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
                  <span className="hidden sm:inline">جاري الطباعة...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-800" />
                  <span className="hidden sm:inline">طباعة يومي</span>
                  <span className="sm:hidden">يومي</span>
                </>
              )}
            </button>

            {/* DEDICATED WEEKLY REPORT PRINT BUTTON */}
            {onPrintWeekly && (
              <button
                type="button"
                onClick={onPrintWeekly}
                disabled={isPrinting}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition shadow-sm active:scale-95 border border-emerald-900 disabled:opacity-60 min-h-[38px]"
                title="طباعة التقرير الأسبوعي الشامل مع كافة البنود الـ 12 بنقرة واحدة"
              >
                {isPrinting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span className="hidden sm:inline">جاري التجهيز...</span>
                  </>
                ) : (
                  <>
                    <CalendarRange className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    <span className="hidden sm:inline">طباعة أسبوعي</span>
                    <span className="sm:hidden">أسبوعي</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Secondary Row: Utilities & Copies */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs pt-1 border-t border-slate-100">
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Save to Archive Button */}
            {onSaveToArchive && (
              <button
                type="button"
                onClick={onSaveToArchive}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition text-[11px] font-bold shadow-2xs"
                title="حفظ هذا التقرير في الأرشيف الدائم للرجوع إليه لاحقاً"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>حفظ في الأرشيف</span>
              </button>
            )}

            {/* Load Sample Button */}
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition text-[11px]"
              title="تعبئة بيانات تقرير نموذجي"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>نموذج تجريبي</span>
            </button>

            {/* Draft actions */}
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              title="حفظ المسودة في المتصفح"
            >
              <Save className="w-3 h-3 text-slate-600" />
              <span>حفظ</span>
            </button>

            {hasSavedDraft && (
              <button
                type="button"
                onClick={onLoadDraft}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition"
                title="استرجاع آخر مسودة محفوظة"
              >
                <Download className="w-3 h-3" />
                <span>استرجاع</span>
              </button>
            )}

            {/* Reset button */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
              title="إعادة تعيين النموذج للقيم الافتراضية"
            >
              <RotateCcw className="w-3 h-3" />
              <span>تفريغ</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 mr-auto">
            {/* Copy Markdown */}
            <div className="inline-flex rounded shadow-2xs" role="group">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-r text-[11px] font-bold bg-slate-800 hover:bg-slate-900 text-white transition border-l border-slate-700"
              >
                {copiedType === 'markdown' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>تم!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Markdown</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onOpenMarkdownModal}
                className="px-1.5 py-1 rounded-l text-[11px] font-bold bg-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition"
                title="عرض النص كـ Markdown ونسخه"
              >
                <Code2 className="w-3 h-3" />
              </button>
            </div>

            {/* Copy Plain text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
            >
              {copiedType === 'text' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>تم!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3 text-slate-600" />
                  <span>نسخ نص</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

