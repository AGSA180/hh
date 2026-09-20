import React from 'react';
import { Sun, Moon, Calendar, CalendarRange, Clock } from 'lucide-react';
import { ReportType } from '../types';

interface ReportInfoTableProps {
  reportType?: ReportType;
  onReportTypeChange?: (val: ReportType) => void;
  title: string;
  onTitleChange: (val: string) => void;
  dayName?: string;
  onDayNameChange?: (val: string) => void;
  dateDay: string;
  onDateDayChange: (val: string) => void;
  dateMonth: string;
  onDateMonthChange: (val: string) => void;
  dateYear: string;
  onDateYearChange: (val: string) => void;
  weekNumber?: string;
  onWeekNumberChange?: (val: string) => void;
  weekDateRange?: string;
  onWeekDateRangeChange?: (val: string) => void;
  preparedBy: string;
  onPreparedByChange: (val: string) => void;
  timeOfDay: 'صباحاً' | 'مساءً' | '';
  onTimeOfDayChange: (val: 'صباحاً' | 'مساءً' | '') => void;
  isReadOnly?: boolean;
}

const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const COMMON_WEEKS = [
  'الأول',
  'الثاني',
  'الثالث',
  'الرابع',
  'الخامس',
  'السادس',
  'السابع',
  'الثامن',
  'التاسع',
  'العاشر',
  'الحادي عشر',
  'الثاني عشر',
];

export const ReportInfoTable: React.FC<ReportInfoTableProps> = ({
  reportType = 'daily',
  onReportTypeChange,
  title,
  onTitleChange,
  dayName = 'الأحد',
  onDayNameChange,
  dateDay,
  onDateDayChange,
  dateMonth,
  onDateMonthChange,
  dateYear,
  onDateYearChange,
  weekNumber = 'الأول',
  onWeekNumberChange,
  weekDateRange = 'من الأحد إلى الخميس',
  onWeekDateRangeChange,
  preparedBy,
  onPreparedByChange,
  timeOfDay,
  onTimeOfDayChange,
  isReadOnly = false,
}) => {
  const isWeekly = reportType === 'weekly';
  const isItem = reportType === 'item';

  const setTodayDate = () => {
    const d = new Date();
    onDateDayChange(String(d.getDate()).padStart(2, '0'));
    onDateMonthChange(String(d.getMonth() + 1).padStart(2, '0'));
    onDateYearChange('1448');
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    if (onDayNameChange && dayNames[d.getDay()]) {
      onDayNameChange(dayNames[d.getDay()]);
    }
  };

  return (
    <section className="mb-5 overflow-hidden rounded-md border border-slate-300 print:mb-1.5 print:border-slate-400">
      {/* Type Switcher Banner (Hidden on Print) */}
      {!isReadOnly && onReportTypeChange && (
        <div className="no-print bg-emerald-950 text-white px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300">نوع التقرير للتحرير:</span>
            <div className="inline-flex p-0.5 rounded-lg bg-emerald-900/90 border border-emerald-700/60 shadow-inner">
              <button
                type="button"
                onClick={() => onReportTypeChange('daily')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  reportType === 'daily'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <span>📝 كتابة التقرير اليومي</span>
              </button>
              <button
                type="button"
                onClick={() => onReportTypeChange('weekly')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                  isWeekly
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5 text-amber-300" />
                <span>📊 التقرير الأسبوعي (شامل لكافة البنود)</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-emerald-200/90 font-medium">
            {isWeekly
              ? 'نمط التقرير الأسبوعي: يشمل رصد ومتابعة جميع البنود الـ 12 دفعة واحدة'
              : isItem
              ? 'نمط التقرير المستقل: تقرير مخصص ومفصل لبند محدد'
              : 'نمط التقرير اليومي: كتابة تقرير جولة اليوم وتحديد بنود الملاحظات اليومية'}
          </span>
        </div>
      )}

      <table className="w-full text-right border-collapse text-xs sm:text-sm print:text-[8pt]">
        <thead>
          <tr className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-300 print:bg-slate-100">
            <th className="p-2 sm:px-4 sm:py-3 w-28 sm:w-1/3 border-l border-slate-300 print:py-0.8 print:px-2 print:text-[8pt]">بيانات التقرير</th>
            <th className="p-2 sm:px-4 sm:py-3 print:py-0.8 print:px-2 print:text-[8pt]">
              <div className="flex items-center justify-between">
                <span>التفاصيل</span>
                {isWeekly ? (
                  <span className="inline-block bg-emerald-800 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded print:text-[7pt] print:py-0 print:px-1">
                    التقرير الأسبوعي الشامل
                  </span>
                ) : isItem ? (
                  <span className="inline-block bg-blue-800 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded print:text-[7pt] print:py-0 print:px-1">
                    تقرير مستقل لبند
                  </span>
                ) : (
                  <span className="inline-block bg-slate-800 text-emerald-300 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded print:text-[7pt] print:py-0 print:px-1">
                    تقرير يومي معتمد
                  </span>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300 text-slate-800 bg-white">
          {/* Title Row */}
          <tr>
            <td className="p-2 sm:px-4 sm:py-2.5 font-bold bg-slate-50/70 border-l border-slate-300 text-slate-900 align-middle print:py-0.6 print:px-1.5 print:text-[8pt]">
              اسم التقرير / الموضوع:
            </td>
            <td className="p-2 sm:px-4 sm:py-2.5 print:py-0.6 print:px-1.5 print:text-[8pt]">
              {isReadOnly ? (
                <span className="font-semibold text-slate-900">{title || '— لم يحدد —'}</span>
              ) : (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder={
                    isWeekly
                      ? 'التقرير الأسبوعي الشامل للشؤون المدرسية والميدانية...'
                      : isItem
                      ? 'تقرير متابعة مستقل لبند...'
                      : 'تقرير المتابعة الإدارية والميدانية اليومي...'
                  }
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-1.5 border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium text-slate-900 placeholder:text-slate-400 text-sm"
                />
              )}
            </td>
          </tr>

          {/* If Weekly: Week and Period Range */}
          {isWeekly ? (
            <>
              <tr>
                <td className="p-2 sm:px-4 sm:py-2.5 font-bold bg-slate-50/70 border-l border-slate-300 text-slate-900 align-middle">
                  الأسبوع الدراسي:
                </td>
                <td className="p-2 sm:px-4 sm:py-2.5">
                  {isReadOnly ? (
                    <span className="font-bold text-slate-900">الأسبوع {weekNumber || '.....'}</span>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-700 text-xs">الأسبوع:</span>
                        <input
                          type="text"
                          value={weekNumber}
                          onChange={(e) => onWeekNumberChange && onWeekNumberChange(e.target.value)}
                          placeholder="الخامس / الأول ..."
                          className="w-28 sm:w-32 px-2.5 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 font-semibold text-sm"
                        />
                      </div>
                      <div className="no-print flex flex-wrap items-center gap-1 text-xs pt-1">
                        <span className="text-slate-500 text-[11px] font-semibold">خيارات سريعة:</span>
                        {COMMON_WEEKS.slice(0, 6).map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => onWeekNumberChange && onWeekNumberChange(w)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                              weekNumber === w
                                ? 'bg-emerald-700 text-white font-bold'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>

              <tr>
                <td className="p-2 sm:px-4 sm:py-2.5 font-bold bg-slate-50/70 border-l border-slate-300 text-slate-900 align-middle">
                  الفترة الزمنية للتقرير:
                </td>
                <td className="p-2 sm:px-4 sm:py-2.5">
                  {isReadOnly ? (
                    <span className="font-semibold text-slate-900">{weekDateRange || 'من الأحد إلى الخميس'}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={weekDateRange}
                        onChange={(e) => onWeekDateRangeChange && onWeekDateRangeChange(e.target.value)}
                        placeholder="مثال: من الأحد 15 / 03 إلى الخميس 19 / 03 / 1448 هـ"
                        className="w-full max-w-lg px-2.5 sm:px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 text-sm"
                      />
                    </div>
                  )}
                </td>
              </tr>
            </>
          ) : (
            /* If Daily: Day of Week, Date, and Time */
            <>
              <tr>
                <td className="p-2 sm:px-4 sm:py-2.5 font-bold bg-slate-50/70 border-l border-slate-300 text-slate-900 align-middle">
                  اليوم والتاريخ:
                </td>
                <td className="p-2 sm:px-4 sm:py-2.5">
                  {isReadOnly ? (
                    <span className="font-semibold text-slate-900">
                      يوم {dayName || 'الأحد'} الموافق {dateDay || '.....'} / {dateMonth || '.....'} / {dateYear || '1448'} هـ
                    </span>
                  ) : (
                    <div className="space-y-2">
                      {/* Day of Week Selector */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-semibold text-slate-700 text-xs shrink-0">اليوم:</span>
                        <div className="flex flex-wrap items-center gap-1">
                          {DAYS_OF_WEEK.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => onDayNameChange && onDayNameChange(d)}
                              className={`px-2 sm:px-2.5 py-1 sm:py-1 rounded text-xs font-bold transition ${
                                dayName === d
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date Inputs */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1.5 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700 text-xs shrink-0">التاريخ:</span>
                          <div className="flex items-center gap-1 font-medium">
                            <input
                              type="text"
                              maxLength={2}
                              value={dateDay}
                              onChange={(e) => onDateDayChange(e.target.value)}
                              placeholder="اليوم"
                              className="w-12 sm:w-14 text-center px-1.5 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-semibold text-sm"
                            />
                            <span className="text-slate-400">/</span>
                            <input
                              type="text"
                              maxLength={2}
                              value={dateMonth}
                              onChange={(e) => onDateMonthChange(e.target.value)}
                              placeholder="الشهر"
                              className="w-12 sm:w-14 text-center px-1.5 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-semibold text-sm"
                            />
                            <span className="text-slate-400">/</span>
                            <input
                              type="text"
                              maxLength={4}
                              value={dateYear}
                              onChange={(e) => onDateYearChange(e.target.value)}
                              placeholder="السنة"
                              className="w-16 sm:w-20 text-center px-1.5 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-semibold text-sm"
                            />
                            <span className="font-bold text-slate-700 text-xs">هـ</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={setTodayDate}
                          className="no-print sm:mr-auto inline-flex items-center justify-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded transition border border-emerald-200 self-start"
                          title="ضبط اليوم والتاريخ الحالي تلقائياً"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                          <span>تاريخ اليوم تلقائياً</span>
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>

              <tr>
                <td className="p-2 sm:px-4 sm:py-2.5 font-bold bg-slate-50/70 border-l border-slate-300 text-slate-900 align-middle">
                  فترة المتابعة / الوقت:
                </td>
                <td className="p-2 sm:px-4 sm:py-2.5">
                  {isReadOnly ? (
                    <span className="font-semibold text-slate-900">{timeOfDay || 'صباحاً'}</span>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-slate-800 font-medium select-none text-xs sm:text-sm">
                        <input
                          type="radio"
                          name="timeOfDay"
                          checked={timeOfDay === 'صباحاً'}
                          onChange={() => onTimeOfDayChange('صباحاً')}
                          className="w-4 h-4 text-emerald-700 focus:ring-emerald-600 border-slate-300"
                        />
                        <Sun className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold">الفترة الصباحية (صباحاً)</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer text-slate-800 font-medium select-none text-xs sm:text-sm">
                        <input
                          type="radio"
                          name="timeOfDay"
                          checked={timeOfDay === 'مساءً'}
                          onChange={() => onTimeOfDayChange('مساءً')}
                          className="w-4 h-4 text-emerald-700 focus:ring-emerald-600 border-slate-300"
                        />
                        <Moon className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold">الفترة المسائية (مساءً)</span>
                      </label>
                    </div>
                  )}
                </td>
              </tr>
            </>
          )}

          {/* Prepared By Row */}
          <tr>
            <td className="p-2 sm:px-4 sm:py-2.5 font-bold bg-slate-50/70 border-l border-slate-300 text-slate-900 align-middle">
              المعد / وكيل الشؤون المدرسية:
            </td>
            <td className="p-2 sm:px-4 sm:py-2.5">
              {isReadOnly ? (
                <span className="font-bold text-slate-900">{preparedBy}</span>
              ) : (
                <input
                  type="text"
                  value={preparedBy}
                  onChange={(e) => onPreparedByChange(e.target.value)}
                  className="w-full max-w-md px-2.5 sm:px-3 py-1.5 border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900 text-sm"
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

