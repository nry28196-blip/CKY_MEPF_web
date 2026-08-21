import { jsPDF } from 'jspdf';
import { toCanvas } from 'html-to-image';

export const exportElementToPdf = async (elementId: string, filename: string = 'design_report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  // We want to briefly ensure the element is fully visible/rendered if needed, 
  // but for now, we just pass it to html-to-image.
  try {
    const canvas = await toCanvas(element, {
      pixelRatio: 2, // Higher scale for better quality
      backgroundColor: '#0f172a', // Set to match the app's dark theme slate-950/900 background roughly
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate the height of the image in the PDF based on the A4 width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if the content is taller than one A4 page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
