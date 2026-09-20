import React from 'react';

interface SignaturesSectionProps {
  schoolAgentName: string;
  onSchoolAgentNameChange: (name: string) => void;
  schoolPrincipalName: string;
  onSchoolPrincipalNameChange: (name: string) => void;
  isReadOnly?: boolean;
}

export const SignaturesSection: React.FC<SignaturesSectionProps> = ({
  schoolAgentName,
  onSchoolAgentNameChange,
  schoolPrincipalName,
  onSchoolPrincipalNameChange,
  isReadOnly = false,
}) => {
  return (
    <section className="mt-8 pt-4 border-t-2 border-slate-300 print:mt-1.5 print:pt-1.5 print:border-slate-400">
      {/* Main Signatures Grid: Stack on small mobile, 2 columns on desktop and in print */}
      <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3 sm:gap-8 text-center text-xs sm:text-sm print:gap-3">
        {/* School Agent Column (وكيل الشؤون المدرسية) */}
        <div className="bg-slate-50/70 p-3 sm:p-4 rounded-lg border border-slate-300 flex flex-col items-center print:p-1.5 print:bg-transparent print:border-slate-300">
          <h3 className="font-bold text-slate-950 text-xs sm:text-base mb-2 sm:mb-3 text-emerald-950 print:text-[8.5pt] print:mb-0.5">
            وكيل الشؤون المدرسية
          </h3>

          <div className="w-full text-right mb-2 sm:mb-3 print:mb-0.5">
            <label className="block text-[10px] sm:text-[11px] text-slate-500 font-bold mb-1 print:text-[7pt] print:mb-0">الاسم:</label>
            {isReadOnly ? (
              <p className="font-bold text-slate-900 text-sm print:text-[8pt]">{schoolAgentName || 'عبدالله جمعان الشهري'}</p>
            ) : (
              <input
                type="text"
                value={schoolAgentName}
                onChange={(e) => onSchoolAgentNameChange(e.target.value)}
                className="w-full text-center px-2 py-1.5 font-bold text-slate-900 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 text-sm print:text-[8pt] print:py-0"
              />
            )}
          </div>

          <div className="w-full mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dashed border-slate-300 print:mt-1 print:pt-0.5">
            <span className="block text-slate-500 text-[11px] sm:text-xs mb-2 sm:mb-4 print:text-[7pt] print:mb-0">التوقيع:</span>
            <div className="h-10 sm:h-12 flex items-center justify-center print:h-4">
              <span className="text-slate-400 font-mono tracking-widest text-xs sm:text-sm print:text-[7pt]">
                ................................................
              </span>
            </div>
          </div>
        </div>

        {/* School Principal Column (مدير المدرسة) */}
        <div className="bg-slate-50/70 p-3 sm:p-4 rounded-lg border border-slate-300 flex flex-col items-center print:p-1.5 print:bg-transparent print:border-slate-300">
          <h3 className="font-bold text-slate-950 text-xs sm:text-base mb-2 sm:mb-3 text-emerald-950 print:text-[8.5pt] print:mb-0.5">
            مدير المدرسة
          </h3>

          <div className="w-full text-right mb-2 sm:mb-3 print:mb-0.5">
            <label className="block text-[10px] sm:text-[11px] text-slate-500 font-bold mb-1 print:text-[7pt] print:mb-0">الاسم:</label>
            {isReadOnly ? (
              <p className="font-bold text-slate-900 text-sm print:text-[8pt]">{schoolPrincipalName || 'نايف أحمد الشهري'}</p>
            ) : (
              <input
                type="text"
                value={schoolPrincipalName}
                onChange={(e) => onSchoolPrincipalNameChange(e.target.value)}
                className="w-full text-center px-2 py-1.5 font-bold text-slate-900 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 text-sm print:text-[8pt] print:py-0"
              />
            )}
          </div>

          <div className="w-full mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-dashed border-slate-300 print:mt-1 print:pt-0.5">
            <span className="block text-slate-500 text-[11px] sm:text-xs mb-2 sm:mb-4 print:text-[7pt] print:mb-0">التوقيع:</span>
            <div className="h-10 sm:h-12 flex items-center justify-center print:h-4">
              <span className="text-slate-400 font-mono tracking-widest text-xs sm:text-sm print:text-[7pt]">
                ................................................
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
