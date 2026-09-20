import React from 'react';
import { ObservationItem, ObservationStatus, WEEKLY_STANDARD_ITEMS } from '../types';
import { Plus, Trash2, CheckCircle2, AlertTriangle, RefreshCw, ListChecks } from 'lucide-react';

interface ObservationsTableProps {
  observations: ObservationItem[];
  onChangeObservations: (items: ObservationItem[]) => void;
  isReadOnly?: boolean;
  isWeekly?: boolean;
}

export const ObservationsTable: React.FC<ObservationsTableProps> = ({
  observations,
  onChangeObservations,
  isReadOnly = false,
  isWeekly = false,
}) => {
  const updateRow = (id: string, field: 'description' | 'status', value: string) => {
    onChangeObservations(
      observations.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addRow = () => {
    const nextId = String(Date.now());
    onChangeObservations([
      ...observations,
      { id: nextId, description: '', status: '' },
    ]);
  };

  const removeRow = (id: string) => {
    if (observations.length <= 1) {
      // Keep at least one empty row
      onChangeObservations([{ id: '1', description: '', status: '' }]);
      return;
    }
    onChangeObservations(observations.filter((item) => item.id !== id));
  };

  const setAllStatus = (status: ObservationStatus) => {
    onChangeObservations(
      observations.map((item) => ({ ...item, status }))
    );
  };

  const loadAllWeeklyStandardItems = () => {
    onChangeObservations(
      WEEKLY_STANDARD_ITEMS.map((item) => ({
        id: item.id,
        description: item.description,
        status: item.status,
      }))
    );
  };

  return (
    <section className="mb-5 overflow-hidden rounded-md border border-slate-300 bg-white print:mb-1.5 print:border-slate-400">
      {/* Table Header Controls */}
      <div className="bg-emerald-50 text-emerald-950 px-3 sm:px-4 py-2.5 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:py-0.8 print:px-2 print:bg-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-xs sm:text-sm print:text-[8.5pt]">أبرز الملاحظات والرصد الميداني:</h2>
          {isWeekly && (
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-300/80 print:text-[7pt] print:py-0 print:px-1">
              {observations.length} بنداً أسبوعياً
            </span>
          )}
        </div>
        
        {!isReadOnly && (
          <div className="no-print flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <button
              type="button"
              onClick={loadAllWeeklyStandardItems}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-400/80 transition shadow-2xs text-[11px] sm:text-xs"
              title="إدراج وتعبئة قائمة البنود القياسية الشاملة للتقرير الأسبوعي (12 مجال وبند)"
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-700" />
              <span>تعبئة البنود القياسية (12 بند)</span>
            </button>

            <span className="text-slate-400 hidden lg:inline">|</span>

            <span className="text-slate-600 hidden sm:inline text-[11px]">تعيين:</span>
            <button
              type="button"
              onClick={() => setAllStatus('سليم')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 font-medium transition text-[11px]"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              الكل سليم
            </button>
            <button
              type="button"
              onClick={() => setAllStatus('يحتاج معالجة')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition text-[11px]"
            >
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              الكل يحتاج معالجة
            </button>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition shadow-2xs text-[11px] sm:text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة بند
            </button>
          </div>
        )}
      </div>

      {/* MOBILE EDIT MODE (< md): Touch-Friendly Responsive Card List */}
      {!isReadOnly && (
        <div className="md:hidden print:hidden divide-y divide-slate-200 p-2 space-y-2.5 bg-slate-50/50">
          {observations.map((item, index) => {
            const isSound = item.status === 'سليم';
            const needsAction = item.status === 'يحتاج معالجة';

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-300 p-3 shadow-2xs space-y-2.5"
              >
                {/* Mobile Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-300">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      البند رقم ({index + 1})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRow(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    title="حذف هذا البند"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Description Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    وصف الملاحظة / البند:
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateRow(item.id, 'description', e.target.value)}
                    placeholder={`اكتب توصيف الملاحظة رقم ${index + 1}...`}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Mobile Status Buttons */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    الحالة المرصودة:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateRow(item.id, 'status', isSound ? '' : 'سليم')}
                      className={`py-2 px-3 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                        isSound
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 hover:bg-emerald-50 text-emerald-900 border-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>سليم</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRow(item.id, 'status', needsAction ? '' : 'يحتاج معالجة')}
                      className={`py-2 px-3 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                        needsAction
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                          : 'bg-slate-50 hover:bg-amber-50 text-amber-900 border-slate-300'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>يحتاج معالجة</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DESKTOP, READ-ONLY, AND PRINT VIEW: Formal Standard Table */}
      <div className={`${!isReadOnly ? 'hidden md:block print:block' : 'block'} overflow-x-auto`}>
        <table className="w-full text-right border-collapse text-xs sm:text-sm min-w-[340px] sm:min-w-full print:text-[8pt]">
          <thead>
            <tr className="bg-slate-50 text-slate-900 font-bold border-b border-slate-300">
              <th className="p-2 sm:px-3 sm:py-2.5 text-center w-10 sm:w-12 border-l border-slate-300 print:py-0.6 print:px-1.5 print:text-[8pt]">م</th>
              <th className="p-2 sm:px-3 sm:py-2.5 border-l border-slate-300 print:py-0.6 print:px-1.5 print:text-[8pt]">وصف الملاحظة / البند</th>
              <th className="p-2 sm:px-3 sm:py-2.5 text-center w-36 sm:w-52 print:py-0.6 print:px-1.5 print:text-[8pt]">الحالة (سليم / يحتاج معالجة)</th>
              {!isReadOnly && (
                <th className="no-print p-2 text-center w-12">حذف</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {observations.map((item, index) => {
              const isSound = item.status === 'سليم';
              const needsAction = item.status === 'يحتاج معالجة';

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  {/* Index Column */}
                  <td className="p-2 sm:p-2.5 text-center font-bold text-slate-800 border-l border-slate-200 bg-slate-50/50 print:py-0.4 print:px-1 print:text-[8pt]">
                    {index + 1}
                  </td>

                  {/* Description Column */}
                  <td className="p-2 sm:p-2.5 border-l border-slate-200 print:py-0.4 print:px-1.5 print:text-[8pt]">
                    {isReadOnly ? (
                      <p className="min-h-[2rem] py-1 text-slate-900 font-medium print:min-h-0 print:py-0 print:text-[8pt] print:leading-snug">
                        {item.description || <span className="text-slate-400 italic">لا يوجد توصيف</span>}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateRow(item.id, 'description', e.target.value)}
                        placeholder={`وصف الملاحظة رقم ${index + 1}...`}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 placeholder:text-slate-400 text-sm print:py-0 print:text-[8pt]"
                      />
                    )}
                  </td>

                  {/* Status Column */}
                  <td className="p-2 sm:p-2.5 text-center align-middle print:py-0.4 print:px-1">
                    {isReadOnly ? (
                      <span
                        className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold print:py-0 print:px-1.5 print:text-[7.5pt] ${
                          isSound
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : needsAction
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.status || '................'}
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateRow(item.id, 'status', isSound ? '' : 'سليم')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition border ${
                            isSound
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-300'
                          }`}
                        >
                          سليم
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRow(item.id, 'status', needsAction ? '' : 'يحتاج معالجة')}
                          className={`px-2 py-1 rounded text-xs font-semibold transition border ${
                            needsAction
                              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                              : 'bg-white hover:bg-amber-50 text-amber-800 border-slate-300'
                          }`}
                        >
                          يحتاج معالجة
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Action column */}
                  {!isReadOnly && (
                    <td className="no-print p-2 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => removeRow(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="حذف هذا الصف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!isReadOnly && (
        <div className="no-print p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-bold px-3 py-1.5 rounded hover:bg-emerald-100/60 transition"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            إضافة بند جديد للجدول
          </button>
          <span className="text-[11px] text-slate-500">
            إجمالي البنود: {observations.length}
          </span>
        </div>
      )}
    </section>
  );
};
