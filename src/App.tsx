import React, { useState, useEffect } from 'react';
import {
  ReportData,
  INITIAL_REPORT_DATA,
  ObservationItem,
  ReportType,
  createWeeklyReportData,
  createDailyReportData,
  createItemReportData,
  SavedReport,
  REPORT_DOMAINS,
} from './types';
import { SAMPLE_REPORT } from './data/sampleReport';
import { ReportHeader } from './components/ReportHeader';
import { ReportInfoTable } from './components/ReportInfoTable';
import { ReportDomainSelector } from './components/ReportDomainSelector';
import { ObservationsTable } from './components/ObservationsTable';
import { RecommendationsSection } from './components/RecommendationsSection';
import { ReportImagesSection } from './components/ReportImagesSection';
import { SignaturesSection } from './components/SignaturesSection';
import { ActionBar } from './components/ActionBar';
import { MarkdownModal } from './components/MarkdownModal';
import { IndependentReportModal } from './components/IndependentReportModal';
import { SavedReportsModal } from './components/SavedReportsModal';
import {
  getSavedReports,
  saveReportToArchive,
  deleteReportFromArchive,
  duplicateSavedReport,
  exportArchiveToJson,
  importArchiveFromJson,
} from './utils/storage';
import { generateMarkdown } from './utils/formatters';
import { exportReportToPdf } from './utils/pdfExport';
import { printReportDocument } from './utils/printer';
import { FileCheck, Info, Check, Eye, Edit3, ExternalLink, CalendarRange } from 'lucide-react';

const STORAGE_KEY = 'school_report_form_data_v1';
const DRAFT_STORAGE_KEY = 'school_report_form_draft_v1';

export default function App() {
  const [reportData, setReportData] = useState<ReportData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_REPORT_DATA;
  });

  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState<boolean>(false);
  const [isIndependentModalOpen, setIsIndependentModalOpen] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => getSavedReports());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(() => {
    return !!localStorage.getItem(DRAFT_STORAGE_KEY);
  });

  // Autosave to current work state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData));
    } catch {
      // ignore
    }
  }, [reportData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleDomain = (domain: string) => {
    setReportData((prev) => {
      const exists = prev.selectedDomains.includes(domain);
      return {
        ...prev,
        selectedDomains: exists
          ? prev.selectedDomains.filter((d) => d !== domain)
          : [...prev.selectedDomains, domain],
      };
    });
  };

  const handleReportTypeChange = (type: ReportType) => {
    if (type === 'weekly') {
      const weekly = createWeeklyReportData(reportData);
      setReportData(weekly);
      showToast('تم تفعيل التقرير الأسبوعي الشامل مع جميع البنود الـ 12');
    } else {
      setReportData((prev) => ({
        ...prev,
        reportType: 'daily',
        title: prev.title.includes('الأسبوعي') ? '' : prev.title,
      }));
      showToast('تم التبديل إلى نمط التقرير اليومي/الدوري');
    }
  };

  const handleSwitchToDaily = () => {
    handleReportTypeChange('daily');
  };

  const handleSwitchToWeekly = () => {
    handleReportTypeChange('weekly');
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من تفريغ كافة الحقول والبدء بنموذج فارغ؟')) {
      setReportData(INITIAL_REPORT_DATA);
      showToast('تم تفريغ النموذج بنجاح');
    }
  };

  const handleLoadSample = () => {
    setReportData(SAMPLE_REPORT);
    showToast('تم تحميل بيانات تقرير نموذجي مكتمل بنجاح');
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(reportData));
      setHasSavedDraft(true);
      showToast('تم حفظ المسودة بنجاح في ذاكرة المتصفح');
    } catch {
      showToast('تعذر حفظ المسودة');
    }
  };

  const handleLoadDraft = () => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft) {
        setReportData(JSON.parse(draft));
        showToast('تم استرجاع المسودة المحفوظة بنجاح');
      }
    } catch {
      showToast('فشل استرجاع المسودة');
    }
  };

  const handleSelectIndependentDomain = (domain: string) => {
    const itemData = createItemReportData(domain, reportData);
    setReportData(itemData);
    setIsIndependentModalOpen(false);
    showToast(`تم إنشاء تقرير مستقل لبند: ${domain}`);
  };

  const handleSaveToArchive = () => {
    const saved = saveReportToArchive(reportData);
    setSavedReports(getSavedReports());
    setReportData((prev) => ({ ...prev, id: saved.id }));
    showToast(`تم حفظ التقرير في الأرشيف بنجاح (${saved.title})`);
  };

  const handleLoadReport = (report: SavedReport) => {
    setReportData(report.data);
    setIsArchiveModalOpen(false);
    showToast(`تم استرجاع التقرير: ${report.title}`);
  };

  const handleDeleteReport = (id: string) => {
    deleteReportFromArchive(id);
    setSavedReports(getSavedReports());
    showToast('تم حذف التقرير من الأرشيف بنجاح');
  };

  const handleDuplicateReport = (id: string) => {
    const duplicated = duplicateSavedReport(id);
    setSavedReports(getSavedReports());
    if (duplicated) {
      showToast(`تم تكرار التقرير بنجاح: ${duplicated.title}`);
    }
  };

  const handleNewReportFromArchive = () => {
    setIsArchiveModalOpen(false);
    setIsIndependentModalOpen(true);
  };

  const handleDirectPrintFromArchive = async (report: SavedReport) => {
    setReportData(report.data);
    setIsArchiveModalOpen(false);
    showToast(`جاري تجهيز طباعة التقرير: ${report.title}...`);
    setTimeout(() => {
      handlePrint();
    }, 250);
  };

  const handleDirectPdfFromArchive = async (report: SavedReport) => {
    setReportData(report.data);
    setIsArchiveModalOpen(false);
    showToast(`جاري تصدير PDF للتقرير: ${report.title}...`);
    setTimeout(() => {
      handleExportPdf();
    }, 250);
  };

  const handleExportBackup = () => {
    try {
      const jsonStr = exportArchiveToJson();
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ارشيف_تقارير_الشؤون_المدرسية_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('تم تنزيل ملف النسخة الاحتياطية للأرشيف بنجاح');
    } catch {
      showToast('تعذر تصدير النسخة الاحتياطية');
    }
  };

  const handleImportBackup = (jsonContent: string) => {
    try {
      const count = importArchiveFromJson(jsonContent);
      setSavedReports(getSavedReports());
      showToast(`تم استيراد ${count} تقرير بنجاح إلى الأرشيف`);
    } catch (err: any) {
      showToast(err.message || 'فشل استيراد الملف');
    }
  };

  const handleExportPdf = async () => {
    if (isExportingPdf) return;

    setIsExportingPdf(true);
    showToast('جاري تجهيز وتصدير ملف PDF بالهيئة الرسمية...');

    const previousMode = isReadOnly;
    if (!previousMode) {
      setIsReadOnly(true);
    }

    // Wait for DOM to re-render clean formal presentation
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      await exportReportToPdf('official-report-document', reportData);
      showToast('تم تنزيل ملف PDF بنجاح!');
    } catch (err) {
      console.error(err);
      showToast('تعذر تصدير ملف PDF، يرجى المحاولة مرة أخرى أو استخدام زر الطباعة');
    } finally {
      if (!previousMode) {
        setIsReadOnly(false);
      }
      setIsExportingPdf(false);
    }
  };

  const handlePrint = async () => {
    if (isPrinting) return;

    setIsPrinting(true);
    showToast('جاري تجهيز أمر الطباعة...');

    const previousMode = isReadOnly;
    if (!previousMode) {
      setIsReadOnly(true);
    }

    // Give DOM time to switch to clean print styling
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      const result = await printReportDocument('official-report-document', reportData);
      showToast(result.message);
    } catch (err) {
      console.error('Print failed:', err);
      showToast('تعذر فتح أمر الطباعة، يرجى استخدام زر تصدير PDF المباشر');
    } finally {
      if (!previousMode) {
        setIsReadOnly(false);
      }
      setIsPrinting(false);
    }
  };

  const handlePrintDaily = async () => {
    if (isPrinting) return;

    let targetData = reportData;
    if (reportData.reportType !== 'daily') {
      targetData = createDailyReportData(reportData);
      setReportData(targetData);
    }

    setIsPrinting(true);
    showToast('جاري تجهيز التقرير اليومي للطباعة...');

    const previousMode = isReadOnly;
    if (!previousMode) {
      setIsReadOnly(true);
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      const result = await printReportDocument('official-report-document', targetData);
      showToast(result.message);
    } catch (err) {
      console.error('Daily print failed:', err);
      showToast('تعذر فتح أمر الطباعة، يرجى استخدام زر تصدير PDF المباشر');
    } finally {
      if (!previousMode) {
        setIsReadOnly(false);
      }
      setIsPrinting(false);
    }
  };

  const handlePrintWeekly = async () => {
    if (isPrinting) return;

    // Automatically ensure the report is configured with weekly properties and all 12 items
    let targetData = reportData;
    if (reportData.reportType !== 'weekly' || reportData.observations.length < 12) {
      targetData = createWeeklyReportData(reportData);
      setReportData(targetData);
    }

    setIsPrinting(true);
    showToast('جاري تجهيز التقرير الأسبوعي الشامل مع كافة البنود الـ 12 للطباعة...');

    const previousMode = isReadOnly;
    if (!previousMode) {
      setIsReadOnly(true);
    }

    // Wait for DOM to update with all 12 items and printable styling
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const result = await printReportDocument('official-report-document', targetData);
      showToast(result.message);
    } catch (err) {
      console.error('Weekly print failed:', err);
      showToast('تعذر فتح أمر الطباعة، يرجى استخدام زر تصدير PDF');
    } finally {
      if (!previousMode) {
        setIsReadOnly(false);
      }
      setIsPrinting(false);
    }
  };

  // Keyboard shortcut Ctrl+P / Cmd+P to directly trigger print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrinting, isReadOnly, reportData]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-['Cairo',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm font-bold border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="no-print bg-emerald-900 text-white border-b border-emerald-950 py-2.5 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-emerald-800 flex items-center justify-center text-white border border-emerald-700">
              <FileCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight">
                نموذج التقارير الإدارية والميدانية المعتمد
              </h1>
              <p className="text-[11px] text-emerald-200">
                ثانوية الأمير عبدالمجيد الأولى • إدارة التعليم بمحافظة جدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-100 hover:text-white bg-emerald-950/70 hover:bg-emerald-950 px-3 py-1.5 rounded-md border border-emerald-700/80 transition font-medium"
              title="فتح التطبيق في نافذة متصفح مستقلة للحصول على تجربة طباعة أسرع بدون قيود المعاينة"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">فتح في صفحة مستقلة</span>
              <span className="sm:hidden">صفحة مستقلة</span>
            </a>

            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-800/60">
              <Info className="w-3.5 h-3.5 text-emerald-300" />
              <span>جاهز للطباعة الفورية A4 و PDF</span>
            </div>
          </div>
        </div>
      </header>

      {/* Action Toolbar */}
      <ActionBar
        reportData={reportData}
        isReadOnly={isReadOnly}
        onToggleReadOnly={() => setIsReadOnly(!isReadOnly)}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        onSaveDraft={handleSaveDraft}
        hasSavedDraft={hasSavedDraft}
        onLoadDraft={handleLoadDraft}
        onOpenMarkdownModal={() => setIsMarkdownModalOpen(true)}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
        onPrint={handlePrintDaily}
        isPrinting={isPrinting}
        onPrintDaily={handlePrintDaily}
        onPrintWeekly={handlePrintWeekly}
        onSwitchToDaily={handleSwitchToDaily}
        onSwitchToWeekly={handleSwitchToWeekly}
        onOpenIndependentModal={() => setIsIndependentModalOpen(true)}
        onOpenArchiveModal={() => setIsArchiveModalOpen(true)}
        onSaveToArchive={handleSaveToArchive}
        savedReportsCount={savedReports.length}
      />

      {/* Markdown Raw Code Modal */}
      <MarkdownModal
        isOpen={isMarkdownModalOpen}
        onClose={() => setIsMarkdownModalOpen(false)}
        markdownContent={generateMarkdown(reportData)}
      />

      {/* Independent Item Report Domain Picker Modal */}
      <IndependentReportModal
        isOpen={isIndependentModalOpen}
        onClose={() => setIsIndependentModalOpen(false)}
        onSelectDomain={handleSelectIndependentDomain}
        currentDomain={
          reportData.targetDomain ||
          (reportData.selectedDomains.length === 1 ? reportData.selectedDomains[0] : undefined)
        }
      />

      {/* Saved Reports Archive Modal */}
      <SavedReportsModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        savedReports={savedReports}
        currentReportId={reportData.id}
        onLoadReport={handleLoadReport}
        onDeleteReport={handleDeleteReport}
        onDuplicateReport={handleDuplicateReport}
        onNewReport={handleNewReportFromArchive}
        onDirectPrint={handleDirectPrintFromArchive}
        onDirectPdf={handleDirectPdfFromArchive}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Main Document Viewport */}
      <main className="flex-1 py-3 sm:py-6 px-2 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Mode Banner Indicator */}
          <div className="no-print mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              {isReadOnly ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>معاينة المستند الرسمي للطباعة</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>وضع التحرير المباشر (تعديل البيانات)</span>
                </>
              )}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {reportData.reportType === 'weekly' ? (
                <span className="text-emerald-900 bg-emerald-100 font-bold px-2 py-0.5 rounded border border-emerald-300 text-[11px] sm:text-xs">
                  التقرير الأسبوعي الشامل (12 بنداً)
                </span>
              ) : reportData.reportType === 'item' ? (
                <span className="text-blue-900 bg-blue-100 font-bold px-2 py-0.5 rounded border border-blue-300 text-[11px] sm:text-xs">
                  تقرير مستقل لبند: {reportData.targetDomain || reportData.selectedDomains[0] || 'مخصص'}
                </span>
              ) : (
                <span className="text-slate-800 bg-slate-200 font-bold px-2 py-0.5 rounded border border-slate-300 text-[11px] sm:text-xs">
                  تقرير يومي ({reportData.dayName || 'اليومي'})
                </span>
              )}
              <span className="text-slate-500 font-medium text-[11px] sm:text-xs hidden xs:inline">
                A4 صفحة واحدة
              </span>
            </div>
          </div>

          {/* Official Printable Report Container */}
          <div
            id="official-report-document"
            className="report-page-container bg-white rounded-lg shadow-md border sm:border-2 border-emerald-900/40 p-2.5 sm:p-8 md:p-10 relative print:p-6"
          >
            {/* Inner Border Line for Formal Saudi Documents */}
            <div className="border border-emerald-900/30 p-2.5 sm:p-5 md:p-7 rounded-sm print:p-4">
              {/* Header */}
              <ReportHeader
                dateDay={reportData.dateDay}
                dateMonth={reportData.dateMonth}
                dateYear={reportData.dateYear}
                dayName={reportData.dayName}
                reportType={reportData.reportType}
                weekNumber={reportData.weekNumber}
              />

              {/* General Information Table */}
              <ReportInfoTable
                reportType={reportData.reportType}
                onReportTypeChange={handleReportTypeChange}
                title={reportData.title}
                onTitleChange={(val) => setReportData((prev) => ({ ...prev, title: val }))}
                dayName={reportData.dayName}
                onDayNameChange={(val) => setReportData((prev) => ({ ...prev, dayName: val }))}
                dateDay={reportData.dateDay}
                onDateDayChange={(val) => setReportData((prev) => ({ ...prev, dateDay: val }))}
                dateMonth={reportData.dateMonth}
                onDateMonthChange={(val) => setReportData((prev) => ({ ...prev, dateMonth: val }))}
                dateYear={reportData.dateYear}
                onDateYearChange={(val) => setReportData((prev) => ({ ...prev, dateYear: val }))}
                weekNumber={reportData.weekNumber}
                onWeekNumberChange={(val) => setReportData((prev) => ({ ...prev, weekNumber: val }))}
                weekDateRange={reportData.weekDateRange}
                onWeekDateRangeChange={(val) => setReportData((prev) => ({ ...prev, weekDateRange: val }))}
                preparedBy={reportData.preparedBy}
                onPreparedByChange={(val) => setReportData((prev) => ({ ...prev, preparedBy: val }))}
                timeOfDay={reportData.timeOfDay}
                onTimeOfDayChange={(val) => setReportData((prev) => ({ ...prev, timeOfDay: val }))}
                isReadOnly={isReadOnly}
              />

              {/* Domains Checklist */}
              <ReportDomainSelector
                selectedDomains={reportData.selectedDomains}
                onToggleDomain={handleToggleDomain}
                onSetSelectedDomains={(domains) =>
                  setReportData((prev) => ({ ...prev, selectedDomains: domains }))
                }
                otherDomain={reportData.otherDomain}
                onOtherDomainChange={(val) => setReportData((prev) => ({ ...prev, otherDomain: val }))}
                domainDetails={reportData.domainDetails || ''}
                onDomainDetailsChange={(val) => setReportData((prev) => ({ ...prev, domainDetails: val }))}
                isReadOnly={isReadOnly}
              />

              {/* Field Observations Table */}
              <ObservationsTable
                observations={reportData.observations}
                onChangeObservations={(obs: ObservationItem[]) =>
                  setReportData((prev) => ({ ...prev, observations: obs }))
                }
                isReadOnly={isReadOnly}
                isWeekly={reportData.reportType === 'weekly'}
              />

              {/* Recommendations and Notes */}
              <RecommendationsSection
                recommendations={reportData.recommendations}
                onChangeRecommendations={(val) =>
                  setReportData((prev) => ({ ...prev, recommendations: val }))
                }
                isReadOnly={isReadOnly}
              />

              {/* Field Evidence & Photos Section */}
              <ReportImagesSection
                images={reportData.images || []}
                onImagesChange={(imgs) =>
                  setReportData((prev) => ({ ...prev, images: imgs }))
                }
                isReadOnly={isReadOnly}
              />

              {/* Signatures & School Principal Approval */}
              <SignaturesSection
                schoolAgentName={reportData.schoolAgentName}
                onSchoolAgentNameChange={(val) =>
                  setReportData((prev) => ({ ...prev, schoolAgentName: val }))
                }
                schoolPrincipalName={reportData.schoolPrincipalName}
                onSchoolPrincipalNameChange={(val) =>
                  setReportData((prev) => ({ ...prev, schoolPrincipalName: val }))
                }
                isReadOnly={isReadOnly}
              />

              {/* Official Document Footer Reference */}
              <footer className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between font-mono">
                <span>نموذج الشؤون المدرسية المعتمد - م/ثانوية الأمير عبدالمجيد الأولى</span>
                <span>العام الدراسي 1448 هـ</span>
              </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

