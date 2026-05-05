import reportModel from "../models/reportModel.js";
import userModel from "../models/userModel.js";

// API to add a new report
const addReport = async (req, res) => {
    try {
        const { userId, testName, category } = req.body;
        
        // Assume added by admin for now, later we use auth token id
        const addedBy = req.body.addedBy || 'admin';

        if (!userId || !testName || !category) {
            return res.json({ success: false, message: "Missing required details" });
        }

        const patient = await userModel.findById(userId).select('-password');
        if (!patient) {
            return res.json({ success: false, message: "Patient not found" });
        }

        const reportData = {
            userId,
            patientData: patient,
            testName,
            category,
            addedBy,
            date: Date.now()
        }

        const newReport = new reportModel(reportData);
        await newReport.save();

        res.json({ success: true, message: 'Report Added Successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all reports for Admin/Staff
const getAllReports = async (req, res) => {
    try {
        const reports = await reportModel.find({}).sort({ date: -1 });
        res.json({ success: true, reports });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update report status or results
const updateReport = async (req, res) => {
    try {
        const { reportId, status, result, fileUrl } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (result) updateData.result = result;
        if (fileUrl) updateData.fileUrl = fileUrl;

        await reportModel.findByIdAndUpdate(reportId, updateData);
        res.json({ success: true, message: 'Report Updated Successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    addReport,
    getAllReports,
    updateReport
}
