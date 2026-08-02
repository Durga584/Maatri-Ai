import { jsPDF } from 'jspdf';
import { PredictionResult } from '../types';

export function generatePredictionPDF(data: PredictionResult, patientName: string = 'Patient'): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(79, 70, 229); // Primary #4F46E5
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MAATRI AI — MATERNAL HEALTH CLINICAL REPORT', 14, 18);

  // Metadata block
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Patient: ${patientName}`, 14, 38);
  doc.text(`Date & Time: ${new Date(data.timestamp).toLocaleString()}`, 14, 44);
  doc.text(`Risk Assessment Result: ${data.risk_level} (Confidence: ${(data.confidence_score * 100).toFixed(1)}%)`, 14, 50);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 55, pageWidth - 14, 55);

  // Physiological Vitals Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Patient Physiological Vitals', 14, 65);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const vitals = data.input_vitals;
  const vitalsText = [
    `• Age: ${vitals.Age} years`,
    `• Systolic BP: ${vitals.SystolicBP} mmHg`,
    `• Diastolic BP: ${vitals.DiastolicBP} mmHg`,
    `• Blood Glucose (BS): ${vitals.BS} mmol/L`,
    `• Body Temperature: ${vitals.BodyTemp} °F`,
    `• Heart Rate: ${vitals.HeartRate} bpm`,
  ];

  let yPos = 73;
  vitalsText.forEach((item) => {
    doc.text(item, 20, yPos);
    yPos += 6;
  });

  // Clinical Alerts & Risk Factors
  yPos += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Clinical Risk Analysis & Alerts', 14, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Primary Indicator: ${data.heuristic_reason}`, 20, yPos);

  if (data.alerts && data.alerts.length > 0) {
    yPos += 6;
    doc.setTextColor(225, 29, 72); // Rose
    data.alerts.forEach((alert) => {
      doc.text(`⚠️ Alert: ${alert}`, 20, yPos);
      yPos += 6;
    });
    doc.setTextColor(51, 65, 85);
  }

  // Recommendations
  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. AI Healthcare Recommendations', 14, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  data.recommendations.forEach((rec) => {
    doc.text(`• ${rec}`, 20, yPos);
    yPos += 6;
  });

  // Footer Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(data.disclaimer || 'Disclaimer: Educational guidance only. Consult your obstetrician for medical advice.', 14, 280);

  // Save PDF file
  doc.save(`Maatri_Health_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
