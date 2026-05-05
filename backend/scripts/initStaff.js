import mongoose from "mongoose";
import staffModel from "../models/staffModel.js";
import bcrypt from "bcrypt";
import 'dotenv/config';

const createStaff = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log("Connected to MongoDB");

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("staff123", salt);

        const staffData = [
            {
                name: "Kamal Hossain",
                email: "labtech@sheba.com",
                password: passwordHash,
                role: "Lab Technician",
                date: Date.now()
            },
            {
                name: "Rina Akter",
                email: "receptionist@sheba.com",
                password: passwordHash,
                role: "Receptionist",
                date: Date.now()
            }
        ];

        for (const staff of staffData) {
            const exists = await staffModel.findOne({ email: staff.email });
            if (!exists) {
                await staffModel.create(staff);
                console.log(`Created ${staff.role}: ${staff.email}`);
            } else {
                console.log(`${staff.role} already exists: ${staff.email}`);
            }
        }

        console.log("Staff initialization complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating staff:", error);
        process.exit(1);
    }
};

createStaff();
