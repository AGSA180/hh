import React from 'react';
import { REPORT_DOMAINS } from '../types';
import { CheckSquare, Square, FileEdit } from 'lucide-react';

interface ReportDomainSelectorProps {
  selectedDomains: string[];
  onToggleDomain: (domain: string) => void;
  onSetSelectedDomains?: (domains: string[]) => void;
  otherDomain: string;
  onOtherDomainChange: (val: string) => void;
  domainDetails?: string;
  onDomainDetailsChange: (val: string) => void;
  isReadOnly?: boolean;
}

export const ReportDomainSelector: React.FC<ReportDomainSelectorProps> = ({
  selectedDomains,
  onToggleDomain,
  onSetSelectedDomains,
  otherDomain,
  onOtherDomainChange,
  domainDetails = '',
  onDomainDetailsChange,
  isReadOnly = false,
}) => {
  const isOtherActive = selectedDomains.includes('أخرى') || otherDomain.trim().length > 0;

  const handleOtherToggle = () => {
    onToggleDomain('أخرى');
  };

  const handleSelectAll = () => {
    if (onSetSelectedDomains) {
      onSetSelectedDomains([...REPORT_DOMAINS]);
    }
  };

  const handleClearAll = () => {
    if (onSetSelectedDomains) {
      onSetSelectedDomains([]);
    }
  };

  return (
    <section className="mb-5 border border-slate-300 rounded-md overflow-hidden bg-white">
      <div className="bg-emerald-50 text-emerald-950 px-4 py-2.5 border-b border-slate-300 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-xs sm:text-sm">مجال التقرير (اختر المجال المناسب):</h2>
        {!isReadOnly && onSetSelectedDomains && (
          <div className="no-print flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded transition"
            >
              تحديد جميع المجالات (12)
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-2 py-0.5 rounded transition"
            >
              إلغاء التحديد
            </button>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
          {REPORT_DOMAINS.map((domain) => {
            const isChecked = selectedDomains.includes(domain);
            return (
              <label
                key={domain}
                onClick={(e) => {
                  if (isReadOnly) e.preventDefault();
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs sm:text-sm border transition select-none cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleDomain(domain)}
                  disabled={isReadOnly}
                  className="sr-only"
                />
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="truncate">{domain}</span>
              </label>
            );
          })}
        </div>

        {/* Other Domain Field */}
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label
              onClick={(e) => {
                if (isReadOnly) e.preventDefault();
              }}
              className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded text-xs sm:text-sm border cursor-pointer select-none shrink-0 ${
                isOtherActive
                  ? 'bg-emerald-50/80 border-emerald-600 text-emerald-950 font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <input
                type="checkbox"
                checked={isOtherActive}
                onChange={handleOtherToggle}
                disabled={isReadOnly}
                className="sr-only"
              />
              {isOtherActive ? (
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>أخرى:</span>
            </label>

            <div className="flex-1">
              {isReadOnly ? (
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {otherDomain || '........................................................'}
                </span>
              ) : (
                <input
                  type="text"
                  value={otherDomain}
                  onChange={(e) => {
                    onOtherDomainChange(e.target.value);
                    if (!selectedDomains.includes('أخرى') && e.target.value.trim().length > 0) {
                      onToggleDomain('أخرى');
                    }
                  }}
                  placeholder="حدد مجالاً آخر في حال عدم توفره في القائمة أعلاه..."
                  className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              )}
            </div>
          </div>
        </div>

        {/* Additional Domain Details / Writing Field */}
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-emerald-800" />
                <span>تحديد / تفاصيل المجال (في حال كان المجال يحتاج كتابة أو توضيح):</span>
              </label>
              {!isReadOnly && (
                <span className="text-[11px] text-slate-400 no-print">
                  (اختياري: لتوضيح الموقع، رقم المبنى، نطاق الصيانة، أو موضوع الزيارة)
                </span>
              )}
            </div>

            {isReadOnly ? (
              <div className="py-1">
                {domainDetails && domainDetails.trim().length > 0 ? (
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 bg-slate-50/80 px-2.5 py-1.5 rounded border border-slate-200">
                    {domainDetails}
                  </p>
                ) : (
                  <span className="text-xs sm:text-sm text-slate-400 font-mono">
                    ........................................................................................................
                  </span>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={domainDetails}
                onChange={(e) => onDomainDetailsChange(e.target.value)}
                placeholder="اكتب هنا أي تفاصيل أو نطاق إضافي للمجال (مثال: صيانة تكييف معمل الحاسب 2، جولة متابعة المبنى ب، ...)"
                className="w-full px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
