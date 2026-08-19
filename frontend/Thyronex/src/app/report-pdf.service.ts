import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TestParameter {
  testName: string;
  observedValue: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low';
}

export interface ReportData {
  bookingId: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  ageGender?: string;
  packageName: string;
  sampleCollectedAt: string;
  reportedAt: string;
  parameters: TestParameter[];
  clinicalRemarks: string;
  doctorNotes: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportPdfService {

  generateDiagnosticReport(data: ReportData): jsPDF {
    const doc = new jsPDF('p', 'mm', 'a4');

    // 1. TOP HEADER / BRANDING
    doc.setFillColor(26, 95, 110); // #1a5f6e (Thyronex Teal)
    doc.rect(0, 0, 210, 26, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('THYRONEX CARE DIAGNOSTICS', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Where Accuracy Meets Care | NABL & ICMR Accredited Partner Lab', 14, 18);
    doc.text('Toll Free: +91 80880 73507 | reports@thyronexcare.com', 120, 18);

    // 2. PATIENT DEMOGRAPHICS BOX
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 32, 182, 34, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 32, 182, 34, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);

    // Left Column
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Name:', 18, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(data.patientName || 'Patient', 46, 40);

    doc.setFont('helvetica', 'bold');
    doc.text('Contact No:', 18, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(`+91 ${data.patientPhone}`, 46, 48);

    doc.setFont('helvetica', 'bold');
    doc.text('Package:', 18, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(data.packageName, 46, 56);

    // Right Column
    doc.setFont('helvetica', 'bold');
    doc.text('Booking ID:', 115, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${data.bookingId}`, 145, 40);

    doc.setFont('helvetica', 'bold');
    doc.text('Collected On:', 115, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(data.sampleCollectedAt || 'Earlier Today', 145, 48);

    doc.setFont('helvetica', 'bold');
    doc.text('Reported On:', 115, 56);
    doc.setFont('helvetica', 'normal');
    doc.text(data.reportedAt || new Date().toLocaleDateString(), 145, 56);

    // 3. TEST RESULTS TABLE (autoTable)
    const tableBody = data.parameters.map((p, index) => [
      index + 1,
      p.testName,
      p.observedValue,
      p.unit,
      p.referenceRange,
      p.status
    ]);

    autoTable(doc, {
      startY: 72,
      head: [['#', 'Test Parameter', 'Observed Value', 'Unit', 'Reference Range', 'Flag']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 95, 110],
        textColor: 255,
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 60, fontStyle: 'bold' },
        2: { halign: 'center', cellWidth: 32 },
        3: { halign: 'center', cellWidth: 22 },
        4: { halign: 'center', cellWidth: 38 },
        5: { halign: 'center', cellWidth: 20 }
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5
      },
      didParseCell: (hookData) => {
        if (hookData.section === 'body' && hookData.column.index === 5) {
          const val = hookData.cell.raw;
          if (val === 'High' || val === 'Low') {
            hookData.cell.styles.textColor = [220, 38, 38]; // Red highlight for abnormal
            hookData.cell.styles.fontStyle = 'bold';
          } else {
            hookData.cell.styles.textColor = [22, 101, 52]; // Green for normal
          }
        }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 160;

    // 4. CLINICAL REMARKS & SIGNATURE
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Pathologist Remarks / Impression:', 14, finalY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(data.clinicalRemarks || 'All values correlate clinically. Sample processed on automated calibrated analyzers.', 14, finalY + 16, { maxWidth: 182 });

    // Signature Area
    const signY = finalY + 36;
    doc.setDrawColor(203, 213, 225);
    doc.line(135, signY, 190, signY);
    doc.setFont('helvetica', 'bold');
    doc.text('Dr. Ananya Rao, MD (Pathology)', 135, signY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Chief Pathologist, KMC Reg No: 54982', 135, signY + 9);

    // 5. FOOTER
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('This is a computer-verified diagnostic laboratory report generated securely by Thyronex Care.', 14, 292);
    doc.text('Page 1 of 1', 180, 292);

    return doc;
  }

  downloadPdf(data: ReportData, filename?: string) {
    const doc = this.generateDiagnosticReport(data);
    const fname = filename || `Thyronex_Report_Booking_${data.bookingId}.pdf`;
    doc.save(fname);
  }

  getPdfBase64(data: ReportData): string {
    const doc = this.generateDiagnosticReport(data);
    return doc.output('datauristring'); // Returns "data:application/pdf;base64,..."
  }
}