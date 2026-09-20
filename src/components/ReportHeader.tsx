import React from 'react';
import { ReportType } from '../types';

interface ReportHeaderProps {
  dateDay: string;
  dateMonth: string;
  dateYear: string;
  dayName?: string;
  reportType?: ReportType;
  weekNumber?: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  dateDay,
  dateMonth,
  dateYear,
  dayName,
  reportType = 'daily',
  weekNumber,
}) => {
  const isWeekly = reportType === 'weekly';
  const isItem = reportType === 'item';

  return (
    <header className="relative mb-6 border-b-2 border-emerald-900/80 pb-5 print:mb-1.5 print:pb-1.5">
      {/* Top Ministerial Ribbon / Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-900 via-amber-500 to-emerald-950 rounded-full mb-4 opacity-90 print:mb-1 print:h-1" />

      {/* Desktop & Print Layout: 3-column balanced architecture */}
      <div className="hidden sm:grid print:grid grid-cols-12 gap-3 items-center print:gap-1.5">
        {/* Right Column (4 cols): Official Kingdom & School Administrative Hierarchy */}
        <div className="col-span-4 text-right pr-1 border-r-2 border-emerald-800/70">
          <div className="space-y-0.5 text-slate-800 print:space-y-0">
            <p className="font-extrabold text-slate-950 text-xs sm:text-sm tracking-wide print:text-[10pt]">
              المملكة العربية السعودية
            </p>
            <p className="text-emerald-900 font-black text-xs sm:text-[13px] flex items-center gap-1 print:text-[9.5pt]">
              <span>وزارة التعليم</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-700 font-semibold print:text-[8pt]">
              الإدارة العامة للتعليم بمحافظة جدة
            </p>
            <p className="text-[11px] sm:text-xs text-slate-800 font-bold print:text-[8.5pt]">
              ثانوية الأمير عبدالمجيد الأولى
            </p>
            <div className="pt-0.5">
              <span className="inline-block text-[10px] sm:text-[11px] font-extrabold text-emerald-950 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs print:py-0 print:px-1 print:text-[7.5pt]">
                الشؤون المدرسية
              </span>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Classical Calligraphy */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center px-1 self-stretch py-2 print:py-0">
          <div className="text-slate-800 text-sm sm:text-base font-serif font-bold tracking-wider select-none print:text-[11pt]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>

        {/* Left Column (4 cols): Official Document Meta & Reference */}
        <div className="col-span-4 pl-1">
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-md p-2 text-xs font-medium space-y-1 print:p-1 print:space-y-0.5 print:text-[7.5pt]">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-semibold text-[11px] print:text-[7.5pt]">الرقم:</span>
              <span className="font-mono text-slate-800 font-bold text-[11px] print:text-[7.5pt]">.....................</span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-semibold text-[11px] print:text-[7.5pt]">التاريخ:</span>
              <span className="font-mono text-slate-900 font-bold text-[11px] print:text-[7.5pt]">
                {isWeekly && weekNumber ? (
                  <span>الأسبوع {weekNumber} - {dateYear || '1448'}هـ</span>
                ) : (
                  <span>
                    {dayName ? `${dayName} ` : ''}
                    {dateDay || '.....'} / {dateMonth || '.....'} / {dateYear || '1448'}هـ
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-semibold text-[11px] print:text-[7.5pt]">المشفوعات:</span>
              <span className="font-mono text-slate-800 text-[11px] print:text-[7.5pt]">.....................</span>
            </div>

            <div className="pt-0.5 border-t border-slate-200/70 flex justify-between items-center">
              <span className="text-slate-500 font-semibold text-[10px] print:text-[7pt]">النوع:</span>
              <span
                className={`text-[10px] font-black px-1.5 py-0.2 rounded print:text-[7pt] ${
                  isWeekly
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : isItem
                    ? 'bg-blue-100 text-blue-950 border border-blue-300'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                }`}
              >
                {isWeekly ? 'تقرير أسبوعي شامل' : isItem ? 'تقرير مستقل لبند' : 'تقرير يومي وميداني'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Screen Layout (< sm): Stacked Bismillah & Balanced Two-Column Header */}
      <div className="sm:hidden print:hidden space-y-3">
        {/* Mobile Bismillah Header */}
        <div className="text-center py-1 border-b border-emerald-900/20">
          <span className="text-slate-800 text-sm font-serif font-bold tracking-wider select-none">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        {/* Mobile Sub-Header Grid */}
        <div className="grid grid-cols-2 gap-2.5 items-stretch text-xs">
          {/* Right: Administrative Hierarchy */}
          <div className="text-right pr-2 border-r-2 border-emerald-800/80 flex flex-col justify-between py-0.5">
            <div className="space-y-0.5">
              <p className="font-extrabold text-slate-950 text-[11px] leading-tight">
                المملكة العربية السعودية
              </p>
              <p className="text-emerald-900 font-black text-[11px] leading-tight flex items-center gap-1">
                <span>وزارة التعليم</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
              </p>
              <p className="text-[10px] text-slate-700 font-medium leading-tight">
                تعليم جدة
              </p>
              <p className="text-[10px] text-slate-800 font-bold leading-tight">
                م/ث الأمير عبدالمجيد الأولى
              </p>
            </div>
            <div className="pt-1">
              <span className="inline-block text-[9px] font-extrabold text-emerald-950 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded">
                الشؤون المدرسية
              </span>
            </div>
          </div>

          {/* Left: Document Meta Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[10px] flex flex-col justify-between space-y-1">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-bold">التاريخ:</span>
              <span className="font-mono text-slate-900 font-bold">
                {isWeekly && weekNumber ? (
                  <span>أسبوع {weekNumber}</span>
                ) : (
                  <span>{dateDay || '..'}/{dateMonth || '..'}/{dateYear || '48'}</span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-bold">اليوم:</span>
              <span className="text-slate-800 font-semibold">{dayName || 'الأحد'}</span>
            </div>

            <div className="pt-1 border-t border-slate-200 flex justify-between items-center">
              <span className="text-slate-500 font-semibold">النوع:</span>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                  isWeekly
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                }`}
              >
                {isWeekly ? 'أسبوعي شامل' : 'يومي ميداني'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Title Banner Plaque */}
      <div className="mt-4 relative">
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-850 to-emerald-950 text-white text-center py-2.5 px-4 rounded-md shadow-xs border-2 border-emerald-800 relative overflow-hidden">
          {/* Subtle Background Pattern Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-700/20 via-transparent to-transparent pointer-events-none" />

          {/* Decorative Corner Ornaments */}
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400/80 text-xs sm:text-sm select-none">
            ❖
          </span>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400/80 text-xs sm:text-sm select-none">
            ❖
          </span>

          <h1 className="text-sm sm:text-lg font-black tracking-normal text-white">
            {isWeekly
              ? 'التقرير الأسبوعي الشامل للشؤون المدرسية والميدانية'
              : 'تقرير المتابعة الإدارية والميدانية اليومي'}
          </h1>

          <p className="text-[10px] sm:text-xs text-emerald-200 mt-0.5 font-medium">
            {isWeekly
              ? 'سجل المتابعة والرصد الأسبوعي المعتمد لكافة بنود ومرافق المدرسة'
              : 'سجل الرصد الميداني واليومي لسير اليوم الدراسي وجاهزية المرافق'}
          </p>
        </div>
      </div>
    </header>
  );
};


