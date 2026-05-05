import mongoose from "mongoose";
import bcrypt from "bcrypt";
import staffModel from "./models/staffModel.js";
import 'dotenv/config';

const seedStaff = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("12345678", salt);

        // Delete existing ones
        await staffModel.deleteMany({ email: { $in: ["labtech@sheba.com", "receptionist@sheba.com"] } });

        // Lab Tech
        const labTech = new staffModel({
            name: "John LabTech",
            email: "labtech@sheba.com",
            password: hashedPassword,
            role: "Lab Technician",
            date: Date.now()
        });

        // Receptionist
        const receptionist = new staffModel({
            name: "Jane Receptionist",
            email: "receptionist@sheba.com",
            password: hashedPassword,
            role: "Receptionist",
            date: Date.now()
        });

        await labTech.save();
        console.log("Lab Technician account created.");

        await receptionist.save();
        console.log("Receptionist account created.");

        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}
seedStaff();
