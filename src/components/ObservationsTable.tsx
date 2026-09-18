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
    <section className="mb-5 overflow-hidden rounded-md border border-slate-300 bg-white">
      {/* Table Header Controls */}
      <div className="bg-emerald-50 text-emerald-950 px-4 py-2.5 border-b border-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-xs sm:text-sm">أبرز الملاحظات والرصد الميداني:</h2>
          {isWeekly && (
            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-300/80">
              جميع بنود التقرير الأسبوعي ({observations.length} بنداً)
            </span>
          )}
        </div>
        
        {!isReadOnly && (
          <div className="no-print flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={loadAllWeeklyStandardItems}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-400/80 transition shadow-xs"
              title="إدراج وتعبئة قائمة البنود القياسية الشاملة للتقرير الأسبوعي (12 مجال وبند)"
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-700" />
              <span>تعبئة جميع البنود القياسية (12 بند)</span>
            </button>

            <span className="text-slate-400 hidden md:inline">|</span>

            <span className="text-slate-600 hidden sm:inline">تعيين جماعي:</span>
            <button
              type="button"
              onClick={() => setAllStatus('سليم')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 font-medium transition"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              الكل سليم
            </button>
            <button
              type="button"
              onClick={() => setAllStatus('يحتاج معالجة')}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition"
            >
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              الكل يحتاج معالجة
            </button>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة بند
            </button>
          </div>
        )}
      </div>

      {/* Observations Table */}
      <table className="w-full text-right border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-900 font-bold border-b border-slate-300">
            <th className="p-2 sm:px-3 sm:py-2.5 text-center w-12 border-l border-slate-300">م</th>
            <th className="p-2 sm:px-3 sm:py-2.5 border-l border-slate-300">وصف الملاحظة / البند</th>
            <th className="p-2 sm:px-3 sm:py-2.5 text-center w-44 sm:w-52">الحالة (سليم / يحتاج معالجة)</th>
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
                <td className="p-2 sm:p-2.5 text-center font-bold text-slate-800 border-l border-slate-200 bg-slate-50/50">
                  {index + 1}
                </td>

                {/* Description Column */}
                <td className="p-2 sm:p-2.5 border-l border-slate-200">
                  {isReadOnly ? (
                    <p className="min-h-[2rem] py-1 text-slate-900 font-medium">
                      {item.description || <span className="text-slate-400 italic">لا يوجد توصيف</span>}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateRow(item.id, 'description', e.target.value)}
                      placeholder={`وصف الملاحظة رقم ${index + 1}...`}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  )}
                </td>

                {/* Status Column */}
                <td className="p-2 sm:p-2.5 text-center align-middle">
                  {isReadOnly ? (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
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
