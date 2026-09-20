import React from 'react';
import {
  X,
  PlusCircle,
  FileText,
  CalendarRange,
  Layers,
  Sparkles,
  CheckCircle2,
  FilePlus2,
  Calendar,
} from 'lucide-react';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewDaily: () => void;
  onNewWeekly: () => void;
  onNewIndependent: () => void;
  onNewBlank: () => void;
  currentReportTitle?: string;
}

export const NewReportModal: React.FC<NewReportModalProps> = ({
  isOpen,
  onClose,
  onNewDaily,
  onNewWeekly,
  onNewIndependent,
  onNewBlank,
  currentReportTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-800 border border-emerald-700">
              <PlusCircle className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">إنشاء تقرير جديد</h3>
              <p className="text-xs text-emerald-200">اختر نوع التقرير الذي ترغب في البدء به</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 p-3.5 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <span className="font-bold">ملاحظة أمان البيانات:</span> تقريرك الحالي{' '}
            <span className="font-semibold underline">
              ({currentReportTitle || 'التقرير الحالي'})
            </span>{' '}
            محفوظ تلقائياً في <strong>سجل التقارير السابقة</strong> ولن تفقد أي معلومة كتبتها.
          </div>
        </div>

        {/* Options List */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Option 1: New Daily Report */}
          <button
            type="button"
            onClick={() => {
              onNewDaily();
              onClose();
            }}
            className="w-full text-right p-3.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/60 transition group flex items-center justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-emerald-100 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-950">
                  تقرير متابعة يومي جديد
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  رصد جولة اليوم وتحديد البنود الميدانية والملاحظات والتوصيات
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded">
              اختيار
            </span>
          </button>

          {/* Option 2: New Weekly Report */}
          <button
            type="button"
            onClick={() => {
              onNewWeekly();
              onClose();
            }}
            className="w-full text-right p-3.5 rounded-lg border border-slate-200 hover:border-amber-600 hover:bg-amber-50/60 transition group flex items-center justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-amber-100 text-amber-900 group-hover:bg-amber-700 group-hover:text-white transition">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-amber-950">
                  تقرير أسبوعي شامل (12 بنداً)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  رصد شامل ومفصل لجميع بنود المدرسة الـ 12 دفعة واحدة
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded">
              اختيار
            </span>
          </button>

          {/* Option 3: Independent Item Report */}
          <button
            type="button"
            onClick={() => {
              onNewIndependent();
              onClose();
            }}
            className="w-full text-right p-3.5 rounded-lg border border-slate-200 hover:border-blue-600 hover:bg-blue-50/60 transition group flex items-center justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-blue-100 text-blue-900 group-hover:bg-blue-700 group-hover:text-white transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-950">
                  تقرير مستقل لبند محدد
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  إنشاء تقرير مخصص ومفصل لأي بند (أمن وسلامة، صيانة، نظافة، مقصف، فصول...)
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded">
              اختيار البند
            </span>
          </button>

          {/* Option 4: Blank Report */}
          <button
            type="button"
            onClick={() => {
              onNewBlank();
              onClose();
            }}
            className="w-full text-right p-3.5 rounded-lg border border-slate-200 hover:border-slate-500 hover:bg-slate-50 transition group flex items-center justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-slate-100 text-slate-700 group-hover:bg-slate-700 group-hover:text-white transition">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  تقرير فارغ جديد
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  بدء نموذج فارغ ونظيف لإدخال البيانات والتفاصيل من البداية
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded">
              فارغ
            </span>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
