import { ReportData, SavedReport } from '../types';

export const SAVED_REPORTS_KEY = 'school_reports_archive_v2';
export const CURRENT_WORK_KEY = 'school_report_form_data_v1';

/**
 * Retrieve all saved reports from local storage, sorted latest first.
 */
export function getSavedReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(SAVED_REPORTS_KEY);
    if (!raw) return [];
    const list: SavedReport[] = JSON.parse(raw);
    return Array.isArray(list)
      ? list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      : [];
  } catch (err) {
    console.error('Failed to load saved reports:', err);
    return [];
  }
}

/**
 * Save or update a report in the archive.
 */
export function saveReportToArchive(data: ReportData, asNew: boolean = false): SavedReport {
  const currentList = getSavedReports();
  const now = new Date().toISOString();

  const reportId = asNew || !data.id || data.id === 'rep_init' ? `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` : data.id;

  const dateString = `${data.dateDay || '15'}/${data.dateMonth || '03'}/${data.dateYear || '1448'}`;
  const dayName = data.dayName || 'الأحد';

  let title = data.title?.trim() || '';
  if (!title) {
    if (data.reportType === 'item') {
      title = `تقرير مستقل: ${data.targetDomain || data.selectedDomains[0] || 'بند مدرسي'}`;
    } else if (data.reportType === 'weekly') {
      title = `التقرير الأسبوعي الشامل - الأسبوع ${data.weekNumber || 'الخامس'}`;
    } else {
      title = `تقرير المتابعة اليومي - يوم ${dayName} (${dateString})`;
    }
  }

  const updatedData: ReportData = {
    ...data,
    id: reportId,
    title,
  };

  const newEntry: SavedReport = {
    id: reportId,
    title,
    reportType: data.reportType || 'daily',
    targetDomain: data.targetDomain || (data.selectedDomains.length === 1 ? data.selectedDomains[0] : undefined),
    dateString,
    dayName,
    createdAt: asNew ? now : currentList.find((r) => r.id === reportId)?.createdAt || now,
    updatedAt: now,
    observationsCount: data.observations?.length || 0,
    data: updatedData,
  };

  const existingIndex = currentList.findIndex((r) => r.id === reportId);
  let nextList: SavedReport[];

  if (existingIndex >= 0 && !asNew) {
    nextList = [...currentList];
    nextList[existingIndex] = newEntry;
  } else {
    nextList = [newEntry, ...currentList];
  }

  try {
    localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(nextList));
  } catch (err) {
    console.error('Failed to save report to archive:', err);
  }

  return newEntry;
}

/**
 * Delete a report from the archive by ID.
 */
export function deleteReportFromArchive(id: string): boolean {
  try {
    const currentList = getSavedReports();
    const filtered = currentList.filter((r) => r.id !== id);
    localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete report:', err);
    return false;
  }
}

/**
 * Duplicate a saved report into a new report entry with updated date/time.
 */
export function duplicateSavedReport(id: string): SavedReport | null {
  const currentList = getSavedReports();
  const found = currentList.find((r) => r.id === id);
  if (!found) return null;

  const duplicatedData: ReportData = {
    ...found.data,
    id: `rep_${Date.now()}`,
    title: `${found.data.title} (نسخة مكررة)`,
  };

  return saveReportToArchive(duplicatedData, true);
}

/**
 * Export all saved reports to a JSON string for download.
 */
export function exportArchiveToJson(): string {
  const reports = getSavedReports();
  return JSON.stringify(
    {
      app: 'school_admin_field_reports',
      exportDate: new Date().toISOString(),
      school: 'ثانوية الأمير عبدالمجيد الأولى',
      count: reports.length,
      reports,
    },
    null,
    2
  );
}

/**
 * Import reports from a JSON string into local storage without losing existing ones.
 */
export function importArchiveFromJson(jsonContent: string): number {
  try {
    const parsed = JSON.parse(jsonContent);
    const importedReports: SavedReport[] = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.reports)
      ? parsed.reports
      : [];

    if (importedReports.length === 0) return 0;

    const currentList = getSavedReports();
    const currentIds = new Set(currentList.map((r) => r.id));

    let addedCount = 0;
    const mergedList = [...currentList];

    importedReports.forEach((item) => {
      if (item && item.id && item.data) {
        if (currentIds.has(item.id)) {
          // generate new ID to avoid conflict
          const newId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          mergedList.push({
            ...item,
            id: newId,
            data: { ...item.data, id: newId },
          });
        } else {
          mergedList.push(item);
        }
        addedCount++;
      }
    });

    localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(mergedList));
    return addedCount;
  } catch (err) {
    console.error('Failed to import archive JSON:', err);
    throw new Error('الملف غير صالح أو ليس بتنسيق JSON المعتمد');
  }
}
