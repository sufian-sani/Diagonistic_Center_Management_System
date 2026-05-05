import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    patientData: { type: Object, required: true },
    testName: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Blood Test', 'MRI', 'X-Ray'
    status: { type: String, default: 'Pending' }, // 'Pending', 'Processing', 'Completed', 'Delivered'
    result: { type: String, default: '' },
    date: { type: Number, required: true },
    fileUrl: { type: String, default: '' }, // URL to downloaded/uploaded PDF
    addedBy: { type: String, required: true }, // Admin or Lab Tech ID
})

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);
export default reportModel;
