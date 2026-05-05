import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const downloadInvoice = (appointment, currency = '$') => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Sheba Diagnostic Centre", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("House 12, Road 4, Dhanmondi", 14, 30);
    doc.text("Dhaka, Bangladesh", 14, 35);
    doc.text("Phone: +880 1234-567890", 14, 40);

    // Invoice Details
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("INVOICE", 150, 22);
    
    doc.setFontSize(10);
    doc.text(`Invoice No: INV-${appointment._id.slice(-6).toUpperCase()}`, 130, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 35);
    doc.text(`Status: PAID`, 130, 40);

    // Line break
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 45, 196, 45);

    // Patient Info
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text("Bill To:", 14, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${appointment.userData?.name || 'Patient'}`, 14, 62);
    doc.text(`Email: ${appointment.userData?.email || 'N/A'}`, 14, 67);
    doc.text(`Phone: ${appointment.userData?.phone || 'N/A'}`, 14, 72);

    // Doctor Info
    doc.setFontSize(11);
    doc.text("Consultation With:", 120, 55);
    doc.setFontSize(10);
    doc.text(`Dr. ${appointment.docData?.name || 'Doctor'}`, 120, 62);
    doc.text(`Speciality: ${appointment.docData?.speciality || 'General'}`, 120, 67);

    // Services Table
    const tableData = [
        [
            "Medical Consultation",
            appointment.docData?.speciality || 'General',
            `${appointment.slotDate} at ${appointment.slotTime}`,
            `${currency}${appointment.amount}`
        ]
    ];

    doc.autoTable({
        startY: 85,
        head: [['Service Description', 'Category', 'Date & Time', 'Amount']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 10, cellPadding: 5 },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY || 120;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Total Paid:", 140, finalY + 15);
    doc.setFontSize(14);
    doc.text(`${currency}${appointment.amount}`, 170, finalY + 15);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for trusting Sheba Diagnostic Centre.", 105, 280, null, null, "center");

    // Save
    doc.save(`Invoice_${appointment._id}.pdf`);
};
