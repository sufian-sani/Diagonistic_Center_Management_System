import mongoose from "mongoose";
import bcrypt from "bcrypt";
import staffModel from "./models/staffModel.js";
import 'dotenv/config';

const setStaffCreds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database Connected");

        // Set up Lab Tech
        const labTechEmail = "labtech@prescripto.com";
        const labTechPass = "labtech123";
        const labTechHashed = await bcrypt.hash(labTechPass, 10);
        
        await staffModel.findOneAndUpdate(
            { email: labTechEmail },
            { 
                name: "Sarah Jenkins", 
                email: labTechEmail, 
                password: labTechHashed, 
                role: "Lab Technician",
                date: Date.now()
            },
            { upsert: true, new: true }
        );
        console.log(`✅ Lab Tech created/updated: ${labTechEmail} / ${labTechPass}`);

        // Set up Receptionist
        const receptionEmail = "reception@prescripto.com";
        const receptionPass = "reception123";
        const receptionHashed = await bcrypt.hash(receptionPass, 10);
        
        await staffModel.findOneAndUpdate(
            { email: receptionEmail },
            { 
                name: "Michael Scott", 
                email: receptionEmail, 
                password: receptionHashed, 
                role: "Receptionist",
                date: Date.now()
            },
            { upsert: true, new: true }
        );
        console.log(`✅ Receptionist created/updated: ${receptionEmail} / ${receptionPass}`);

        process.exit(0);
    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
};

setStaffCreds();
