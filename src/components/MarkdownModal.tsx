import React, { useState } from 'react';
import { Copy, Check, X, Code2 } from 'lucide-react';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
}

export const MarkdownModal: React.FC<MarkdownModalProps> = ({
  isOpen,
  onClose,
  markdownContent,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">نص التقرير بصيغة Markdown للنسخ المباشر</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-50">
          <pre className="text-xs sm:text-sm font-mono text-slate-800 bg-white p-4 rounded-lg border border-slate-200 whitespace-pre-wrap select-all leading-relaxed" dir="ltr">
            {markdownContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            يمكنك تحديد النص بالكامل أو استخدام زر النسخ
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>تم النسخ بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ النص كاملاً</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition border border-slate-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
