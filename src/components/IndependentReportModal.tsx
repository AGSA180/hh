import React, { useState } from 'react';
import { REPORT_DOMAINS, DOMAIN_ITEM_TEMPLATES } from '../types';
import {
  X,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Wrench,
  Compass,
  Sparkle,
  Utensils,
  GraduationCap,
  Megaphone,
  Users,
  BadgeDollarSign,
  Store,
  Wallet,
  DoorClosed,
  PlusCircle,
} from 'lucide-react';

interface IndependentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDomain: (domain: string) => void;
  currentDomain?: string;
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  'أمن وسلامة': <ShieldCheck className="w-5 h-5 text-rose-600" />,
  'صيانة': <Wrench className="w-5 h-5 text-amber-600" />,
  'جولة ميدانية': <Compass className="w-5 h-5 text-blue-600" />,
  'نظافة': <Sparkle className="w-5 h-5 text-emerald-600" />,
  'زيارة للمقصف': <Utensils className="w-5 h-5 text-orange-600" />,
  'المقصف المدرسي': <Store className="w-5 h-5 text-amber-700" />,
  'زيارة للفصول': <GraduationCap className="w-5 h-5 text-indigo-600" />,
  'برنامج مدرسي': <Megaphone className="w-5 h-5 text-purple-600" />,
  'متابعة عمل الإداريين': <Users className="w-5 h-5 text-teal-600" />,
  'الميزانية التشغيلية': <BadgeDollarSign className="w-5 h-5 text-green-700" />,
  'الصندوق المدرسي': <Wallet className="w-5 h-5 text-emerald-700" />,
  'بواب المدرسة': <DoorClosed className="w-5 h-5 text-slate-700" />,
};

export const IndependentReportModal: React.FC<IndependentReportModalProps> = ({
  isOpen,
  onClose,
  onSelectDomain,
  currentDomain,
}) => {
  const [customDomain, setCustomDomain] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDomain.trim()) {
      onSelectDomain(customDomain.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-800 border border-emerald-700">
              <FileCheck2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">كتابة تقرير مستقل عن بند محدد</h3>
              <p className="text-[11px] sm:text-xs text-emerald-200">
                اختر البند المطلوب لإعداد تقرير رسمي متخصص ومستقل ببنوده وتوصياته الخاصة
              </p>
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

        {/* Modal Body: List of 12 Domains */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              عند اختيار أي بند من البنود أدناه، سيتم تلقائياً تخصيص عنوان التقرير، وتعبئة بنود الرصد الميداني النموذجية التابعة له، وتجهيز التوصيات المقترحة بما يناسب هذا البند فقط في <strong>صفحة واحدة معتمدة</strong>.
            </p>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2.5">
              قائمة البنود والمجالات المدرسية المتاحة (12 بنداً قياسياً):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {REPORT_DOMAINS.map((domain) => {
                const template = DOMAIN_ITEM_TEMPLATES[domain];
                const isSelected = currentDomain === domain;
                const icon = DOMAIN_ICONS[domain] || <FileCheck2 className="w-5 h-5 text-emerald-700" />;

                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => {
                      onSelectDomain(domain);
                      onClose();
                    }}
                    className={`p-3 rounded-lg border text-right transition flex items-start gap-3 group relative ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-slate-100 group-hover:bg-emerald-100/70 transition shrink-0 mt-0.5">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-950">
                          {domain}
                        </h4>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded">
                            الحالي
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {template?.details || 'إعداد تقرير تفصيلي مستقل لهذا البند'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Domain Input */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block text-xs font-bold text-slate-700 mb-1.5">
              أو كتابة بند مخصص آخر غير موجود بالقائمة:
            </span>
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="مثال: المعامل المدرسية، مركز مصادر التعلم، حديقة المدرسة..."
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!customDomain.trim()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>بدء التقرير</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
