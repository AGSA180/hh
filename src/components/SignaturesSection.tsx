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
    <section className="mt-8 pt-4 border-t-2 border-slate-300">
      {/* Main Signatures Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 text-center text-xs sm:text-sm">
        {/* School Agent Column (وكيل الشؤون المدرسية) */}
        <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-300 flex flex-col items-center">
          <h3 className="font-bold text-slate-950 text-sm sm:text-base mb-3 text-emerald-950">
            وكيل الشؤون المدرسية
          </h3>

          <div className="w-full text-right mb-3">
            <label className="block text-[11px] text-slate-500 font-bold mb-1">الاسم:</label>
            {isReadOnly ? (
              <p className="font-bold text-slate-900">{schoolAgentName || 'عبدالله جمعان الشهري'}</p>
            ) : (
              <input
                type="text"
                value={schoolAgentName}
                onChange={(e) => onSchoolAgentNameChange(e.target.value)}
                className="w-full text-center px-2 py-1 font-bold text-slate-900 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600"
              />
            )}
          </div>

          <div className="w-full mt-3 pt-3 border-t border-dashed border-slate-300">
            <span className="block text-slate-500 text-xs mb-4">التوقيع:</span>
            <div className="h-12 flex items-center justify-center">
              <span className="text-slate-400 font-mono tracking-widest text-sm">
                ................................................
              </span>
            </div>
          </div>
        </div>

        {/* School Principal Column (مدير المدرسة) */}
        <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-300 flex flex-col items-center">
          <h3 className="font-bold text-slate-950 text-sm sm:text-base mb-3 text-emerald-950">
            مدير المدرسة
          </h3>

          <div className="w-full text-right mb-3">
            <label className="block text-[11px] text-slate-500 font-bold mb-1">الاسم:</label>
            {isReadOnly ? (
              <p className="font-bold text-slate-900">{schoolPrincipalName || 'نايف أحمد الشهري'}</p>
            ) : (
              <input
                type="text"
                value={schoolPrincipalName}
                onChange={(e) => onSchoolPrincipalNameChange(e.target.value)}
                className="w-full text-center px-2 py-1 font-bold text-slate-900 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600"
              />
            )}
          </div>

          <div className="w-full mt-3 pt-3 border-t border-dashed border-slate-300">
            <span className="block text-slate-500 text-xs mb-4">التوقيع:</span>
            <div className="h-12 flex items-center justify-center">
              <span className="text-slate-400 font-mono tracking-widest text-sm">
                ................................................
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
