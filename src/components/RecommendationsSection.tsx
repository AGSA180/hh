import React from 'react';
import { Sparkles, MessageSquareQuote } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations: string;
  onChangeRecommendations: (val: string) => void;
  isReadOnly?: boolean;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  onChangeRecommendations,
  isReadOnly = false,
}) => {
  const quickRecommendations = [
    'مخاطبة إدارة التعليم / قسم الصيانة لمتابعة وإصلاح الملاحظات المرصودة عاجلاً.',
    'التأكيد على متعهد المقصف المدرسي بالالتزام الكامل بالاشتراطات الصحية والغذائية.',
    'تعزيز الإجراءات الوقائية والأمنية عند بوابات المدرسة ومخارج الطوارئ.',
    'التشديد على استمرار خطة النظافة اليومية ومتابعة عمال النظافة بانتظام.',
  ];

  const handleAppendSuggestion = (text: string) => {
    if (!recommendations.trim()) {
      onChangeRecommendations(`• ${text}`);
    } else {
      onChangeRecommendations(`${recommendations.trim()}\n• ${text}`);
    }
  };

  return (
    <section className="mb-6 rounded-md border border-slate-300 bg-white overflow-hidden">
      <div className="bg-emerald-50 text-emerald-950 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between">
        <h2 className="font-bold text-xs sm:text-sm flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-emerald-800" />
          المرئيات والتوصيات المقترحة:
        </h2>
      </div>

      <div className="p-3 sm:p-4">
        {isReadOnly ? (
          <div className="min-h-[80px] text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line">
            {recommendations || (
              <p className="text-slate-400 font-mono tracking-widest leading-loose">
                ........................................................................................................................................................................................................................................................................................................
              </p>
            )}
          </div>
        ) : (
          <>
            <textarea
              rows={4}
              value={recommendations}
              onChange={(e) => onChangeRecommendations(e.target.value)}
              placeholder="اكتب التوصيات الإدارية والمرئيات المقترحة هنا لمعالجة الملاحظات المرصودة أو تعزيز الإيجابيات..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded focus:outline-hidden focus:ring-2 focus:ring-emerald-600 leading-relaxed font-medium text-slate-900 placeholder:text-slate-400"
            />

            {/* Quick Suggestions Pills */}
            <div className="no-print mt-3 pt-2.5 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-semibold mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                اقتراحات وتوصيات إدارية شائعة بنقرة واحدة:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {quickRecommendations.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAppendSuggestion(item)}
                    className="text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 px-2 py-1 rounded transition text-right"
                  >
                    + {item.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
