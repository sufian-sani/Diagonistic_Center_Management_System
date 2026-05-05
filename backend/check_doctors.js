import mongoose from 'mongoose';
import 'dotenv/config';

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
}, { strict: false });

const Doctor = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/prescripto");
        const count = await Doctor.countDocuments();
        console.log(`TOTAL DOCTORS IN DB: ${count}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
