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

  return (
    <header className="relative mb-6 border-b-2 border-emerald-900/80 pb-5">
      {/* Top Ministerial Ribbon / Accent Stripe */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-900 via-amber-500 to-emerald-950 rounded-full mb-4 opacity-90" />

      {/* Main Header Row: 3-column balanced architecture */}
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Right Column (4 cols): Official Kingdom & School Administrative Hierarchy */}
        <div className="col-span-4 text-right pr-1 border-r-2 border-emerald-800/70">
          <div className="space-y-0.5 text-slate-800">
            <p className="font-extrabold text-slate-950 text-xs sm:text-sm tracking-wide">
              المملكة العربية السعودية
            </p>
            <p className="text-emerald-900 font-black text-xs sm:text-[13px] flex items-center gap-1">
              <span>وزارة التعليم</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-700 font-semibold">
              الإدارة العامة للتعليم بمحافظة جدة
            </p>
            <p className="text-[11px] sm:text-xs text-slate-800 font-bold">
              ثانوية الأمير عبدالمجيد الأولى
            </p>
            <div className="pt-0.5">
              <span className="inline-block text-[10px] sm:text-[11px] font-extrabold text-emerald-950 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                الشؤون المدرسية
              </span>
            </div>
          </div>
        </div>

        {/* Center Column (4 cols): Classical Calligraphy (Emblem removed per official instruction) */}
        <div className="col-span-4 flex flex-col items-center justify-center text-center px-1 self-stretch py-2">
          {/* Bismillah in Classical Calligraphy */}
          <div className="text-slate-800 text-sm sm:text-base font-serif font-bold tracking-wider select-none">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>

        {/* Left Column (4 cols): Official Document Meta & Reference */}
        <div className="col-span-4 pl-1">
          <div className="bg-slate-50/90 border border-slate-200/90 rounded-md p-2 text-xs font-medium space-y-1">
            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-semibold text-[11px]">الرقم:</span>
              <span className="font-mono text-slate-800 font-bold text-[11px]">.....................</span>
            </div>

            <div className="flex justify-between items-center text-slate-700">
              <span className="text-slate-500 font-semibold text-[11px]">التاريخ:</span>
              <span className="font-mono text-slate-900 font-bold text-[11px]">
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
              <span className="text-slate-500 font-semibold text-[11px]">المشفوعات:</span>
              <span className="font-mono text-slate-800 text-[11px]">.....................</span>
            </div>

            <div className="pt-0.5 border-t border-slate-200/70 flex justify-between items-center">
              <span className="text-slate-500 font-semibold text-[10px]">النوع:</span>
              <span
                className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                  isWeekly
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                }`}
              >
                {isWeekly ? 'تقرير أسبوعي شامل' : 'تقرير يومي وميداني'}
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


