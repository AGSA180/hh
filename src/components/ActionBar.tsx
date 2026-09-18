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
}) => {
  const isWeekly = reportData.reportType === 'weekly';
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
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left / Secondary Action cluster */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Toggle view mode */}
          <button
            type="button"
            onClick={onToggleReadOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold border transition ${
              isReadOnly
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {isReadOnly ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span>العودة للتحرير</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>معاينة المستند</span>
              </>
            )}
          </button>

          {/* Daily vs Weekly Mode Switcher Tabs */}
          {onSwitchToDaily && onSwitchToWeekly && (
            <div className="inline-flex p-0.5 rounded-md bg-slate-100 border border-slate-300">
              <button
                type="button"
                onClick={onSwitchToDaily}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                  !isWeekly
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="التحويل إلى وضع كتابة التقرير اليومي"
              >
                <span>📝 كتابة تقرير يومي</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToWeekly}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                  isWeekly
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="التحويل إلى التقرير الأسبوعي الشامل (كافة البنود الـ 12)"
              >
                <CalendarRange className="w-3.5 h-3.5 text-amber-400" />
                <span>📊 التقرير الأسبوعي</span>
              </button>
            </div>
          )}

          {/* Load Sample Button */}
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
            title="تعبئة بيانات تقرير يومي نموذجي"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>تقرير يومي نموذجي</span>
          </button>

          {/* Draft actions */}
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
            title="حفظ المسودة في المتصفح"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>حفظ</span>
          </button>

          {hasSavedDraft && (
            <button
              type="button"
              onClick={onLoadDraft}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition"
              title="استرجاع آخر مسودة محفوظة"
            >
              <Download className="w-3.5 h-3.5" />
              <span>استرجاع</span>
            </button>
          )}

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
            title="إعادة تعيين النموذج للقيم الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ</span>
          </button>
        </div>

        {/* Right: Primary Export & Copy Cluster */}
        <div className="flex items-center flex-wrap gap-2 mr-auto">
          {/* Copy Markdown */}
          <div className="inline-flex rounded-md shadow-xs" role="group">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-r-md text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white transition border-l border-slate-700"
            >
              {copiedType === 'markdown' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ Markdown</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onOpenMarkdownModal}
              className="px-2 py-1.5 rounded-l-md text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white transition"
              title="عرض النص كـ Markdown ونسخه"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>

          {/* Copy Plain text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
          >
            {copiedType === 'text' ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-slate-600" />
                <span>نسخ نص</span>
              </>
            )}
          </button>

          {/* Direct PDF Download */}
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-slate-700 hover:bg-slate-800 text-white transition shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            title="تصدير وتنزيل ملف PDF رسمي بجودة عالية مباشرة"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                <span>جاري إنشاء PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-slate-200" />
                <span>تصدير PDF</span>
              </>
            )}
          </button>

          {/* DEDICATED DAILY REPORT PRINT BUTTON */}
          <button
            type="button"
            onClick={onPrintDaily || onPrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition shadow-xs active:scale-95 disabled:opacity-60"
            title="طباعة التقرير اليومي الحالي (Ctrl+P)"
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
                <span>جاري الطباعة...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 text-emerald-800" />
                <span>طباعة التقرير اليومي</span>
              </>
            )}
          </button>

          {/* DEDICATED WEEKLY REPORT PRINT BUTTON */}
          {onPrintWeekly && (
            <button
              type="button"
              onClick={onPrintWeekly}
              disabled={isPrinting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition shadow-sm active:scale-95 border border-emerald-900 disabled:opacity-60"
              title="طباعة التقرير الأسبوعي الشامل مع كافة البنود الـ 12 بنقرة واحدة"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>جاري تجهيز التقرير الأسبوعي...</span>
                </>
              ) : (
                <>
                  <CalendarRange className="w-4 h-4 text-amber-300" />
                  <span>طباعة التقرير الأسبوعي (شامل)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

