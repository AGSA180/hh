import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReportData } from '../types';

export async function exportReportToPdf(
  elementId: string,
  reportData: ReportData,
  autoPrint: boolean = false
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('لم يتم العثور على عنصر التقرير');
  }

  // Create clean filename based on report details
  const dateString = `${reportData.dateYear || '1448'}-${reportData.dateMonth || '00'}-${reportData.dateDay || '00'}`;
  const safeTitle = reportData.title
    ? reportData.title.trim().slice(0, 30).replace(/[/\\?%*:|"<>]/g, '_')
    : 'تقرير_إداري_وميداني';
  const fileName = `${safeTitle}_${dateString}.pdf`;

  // Render element to high-res canvas
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution for crisp printing
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      // Ensure the cloned container has white background, formal dimensions, and clean presentation
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        clonedElement.style.width = '794px';
        clonedElement.style.maxWidth = '794px';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.borderRadius = '0';
      }
    },
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // Standard A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  if (autoPrint) {
    pdf.autoPrint({ variant: 'non-conform' });
  }

  const pdfWidth = 210;
  const pdfHeight = 297;
  const margin = 5; // 5mm margins
  const printableWidth = pdfWidth - margin * 2;
  const printableHeight = pdfHeight - margin * 2;

  // Calculate proportional dimensions strictly fitting on 1 single page
  const canvasAspectRatio = canvas.width / canvas.height;
  let finalWidth = printableWidth;
  let finalHeight = finalWidth / canvasAspectRatio;

  if (finalHeight > printableHeight) {
    finalHeight = printableHeight;
    finalWidth = finalHeight * canvasAspectRatio;
  }

  const xOffset = margin + (printableWidth - finalWidth) / 2;
  const yOffset = margin + (printableHeight - finalHeight) / 2;

  // Single page guaranteed without splitting
  pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');

  pdf.save(fileName);
}
