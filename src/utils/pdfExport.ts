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
      // Ensure the cloned container has white background and clean presentation
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
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
  const margin = 7; // 7mm margins
  const printableWidth = pdfWidth - margin * 2;
  const printableHeight = pdfHeight - margin * 2;

  const imgWidth = printableWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= printableHeight) {
    // Fits perfectly in single page
    pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
  } else {
    // If it's only slightly larger (within 10%), scale to fit 1 page elegantly
    if (imgHeight <= printableHeight * 1.1) {
      const fittedWidth = (printableHeight * canvas.width) / canvas.height;
      const xOffset = margin + (printableWidth - fittedWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, margin, fittedWidth, printableHeight, undefined, 'FAST');
    } else {
      // Multi-page export with page slicing
      let heightLeft = imgHeight;
      let position = margin;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          position - page * printableHeight,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
        heightLeft -= printableHeight;
        page++;
      }
    }
  }

  pdf.save(fileName);
}
