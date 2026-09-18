import { ReportData } from '../types';
import { exportReportToPdf } from './pdfExport';

export interface PrintResult {
  success: boolean;
  method: 'window' | 'popup' | 'pdf';
  message: string;
}

/**
 * Robust, cross-environment print trigger:
 * 1. If running outside iframe (standalone tab): triggers native window.print() directly.
 * 2. If running inside iframe (AI Studio preview): opens an isolated printable window to bypass iframe sandbox restrictions.
 * 3. If popup is blocked by browser: automatically exports and downloads high-res PDF with autoPrint activated.
 */
export async function printReportDocument(
  elementId: string,
  reportData: ReportData
): Promise<PrintResult> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('لم يتم العثور على نموذج التقرير في الصفحة');
  }

  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Case 1: Standalone tab - native window.print() is fully supported and unblocked
  if (!isInsideIframe) {
    try {
      window.print();
      return {
        success: true,
        method: 'window',
        message: 'تم فتح نافذة الطباعة بنجاح',
      };
    } catch (err) {
      console.warn('Native window.print failed:', err);
    }
  }

  // Case 2: Inside iframe - attempt opening standalone print window
  try {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let stylesHtml = '';
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
        stylesHtml += node.outerHTML;
      });

      const reportTitle = reportData.title || 'تقرير إداري وميداني - ثانوية الأمير عبدالمجيد الأولى';

      const printHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${reportTitle}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
            ${stylesHtml}
            <style>
              @page {
                size: A4 portrait;
                margin: 8mm 10mm;
              }
              body {
                margin: 0;
                padding: 16px 0;
                background-color: #f1f5f9;
                color: #0f172a;
                font-family: 'Cairo', system-ui, -apple-system, sans-serif;
                direction: rtl;
              }
              .print-banner {
                max-width: 210mm;
                margin: 0 auto 16px auto;
                padding: 12px 16px;
                background-color: #064e3b;
                color: #ffffff;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              .print-action-btn {
                background-color: #10b981;
                color: #ffffff;
                border: none;
                padding: 8px 20px;
                font-size: 14px;
                font-weight: 700;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
                transition: background-color 0.15s;
              }
              .print-action-btn:hover {
                background-color: #059669;
              }
              .close-btn {
                background-color: transparent;
                color: #d1fae5;
                border: 1px solid #059669;
                padding: 8px 16px;
                font-size: 13px;
                font-weight: 600;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
                margin-right: 8px;
              }
              .report-container {
                max-width: 210mm;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              @media print {
                body {
                  background: #ffffff !important;
                  padding: 0 !important;
                }
                .no-print, .print-banner {
                  display: none !important;
                }
                .report-container {
                  box-shadow: none !important;
                  border: none !important;
                  border-radius: 0 !important;
                  max-width: 100% !important;
                  margin: 0 !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-banner no-print">
              <div>
                <strong style="font-size: 15px;">جاهز للطباعة: ثانوية الأمير عبدالمجيد الأولى</strong>
                <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.9;">نافذة طباعة المستند المعتمد بمقاس A4</p>
              </div>
              <div>
                <button class="print-action-btn" onclick="window.print()">🖨️ تأكيد أمر الطباعة</button>
                <button class="close-btn" onclick="window.close()">إغلاق</button>
              </div>
            </div>

            <div class="report-container">
              ${element.outerHTML}
            </div>

            <script>
              // Trigger browser print dialog smoothly
              window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                  window.focus();
                  window.print();
                }, 300);
              });
            <\/script>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();

      return {
        success: true,
        method: 'popup',
        message: 'تم فتح نافذة الطباعة المستقلة بنجاح',
      };
    }
  } catch (windowErr) {
    console.warn('Popup window print blocked or restricted:', windowErr);
  }

  // Case 3: Fallback if popup blocker or sandbox strictly prevented window.open
  try {
    await exportReportToPdf(elementId, reportData, true);
    return {
      success: true,
      method: 'pdf',
      message: 'نظراً لتقييد المتصفح فتح الطابعة داخل نافذة المعاينة، تم تنزيل المستند كملف PDF عالي الدقة جاهز للطباعة فوراً.',
    };
  } catch (pdfErr) {
    console.error('All print options failed:', pdfErr);
    return {
      success: false,
      method: 'pdf',
      message: 'تعذر تشغيل الطابعة، يرجى استخدام زر تصدير PDF المباشر.',
    };
  }
}
