import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";
import 'dotenv/config';

const addDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database Connected for Adding New Doctors");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const newDoctors = [
            {
                name: "Dr. Farhana Haque",
                email: "dr.farhana@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/women/33.jpg",
                speciality: "Psychiatrist",
                degree: "MBBS, MD (Psychiatry)",
                medicalCollege: "Dhaka Medical College, University of Dhaka",
                experience: "14 Years",
                about: "Dr. Farhana Haque is a renowned psychiatrist specializing in cognitive behavioral therapy and mood disorders. She helps patients achieve mental wellness through comprehensive evaluations.",
                fees: 110,
                available: true,
                address: { line1: "House 20, Road 1", line2: "Banani, Dhaka 1213" },
                date: Date.now() - 2000000000
            },
            {
                name: "Dr. Shahin Alam",
                email: "dr.shahin@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/men/22.jpg",
                speciality: "Urologist",
                degree: "MBBS, MS (Urology)",
                medicalCollege: "Rajshahi Medical College, University of Rajshahi",
                experience: "11 Years",
                about: "Dr. Shahin Alam is an expert in urological surgeries and minimally invasive treatments. He is dedicated to providing sensitive and professional care to his patients.",
                fees: 140,
                available: true,
                address: { line1: "Apt 4B, Green Tower", line2: "Mirpur DOHS, Dhaka" },
                date: Date.now() - 1500000000
            },
            {
                name: "Dr. Tasnim Reza",
                email: "dr.tasnim@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/women/12.jpg",
                speciality: "Gynecologist",
                degree: "MBBS, FCPS (Obs & Gynae)",
                medicalCollege: "Mymensingh Medical College, BAU",
                experience: "16 Years",
                about: "Dr. Tasnim Reza is a highly respected gynecologist providing exceptional maternal and reproductive health services. She is known for her warm, patient-first approach.",
                fees: 100,
                available: true,
                address: { line1: "Road 9, Sector 11", line2: "Uttara, Dhaka 1230" },
                date: Date.now() - 1000000000
            },
            {
                name: "Dr. Anisur Rahman",
                email: "dr.anisur@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/men/50.jpg",
                speciality: "ENT Specialist",
                degree: "MBBS, DLO",
                medicalCollege: "Chittagong Medical College, University of Chittagong",
                experience: "9 Years",
                about: "Dr. Anisur Rahman treats complex ear, nose, and throat conditions. He utilizes advanced diagnostic tools to identify and treat hearing and sinus-related issues effectively.",
                fees: 90,
                available: true,
                address: { line1: "Plot 15, Block D", line2: "Bashundhara R/A, Dhaka" },
                date: Date.now() - 500000000
            }
        ];

        let addedCount = 0;
        for (const doc of newDoctors) {
            const exists = await doctorModel.findOne({ email: doc.email });
            if (!exists) {
                const newDoc = new doctorModel(doc);
                await newDoc.save();
                addedCount++;
                console.log(`   👨‍⚕️ Added New Doctor: ${doc.name}`);
            } else {
                console.log(`   ⚠️  Doctor already exists: ${doc.name}`);
            }
        }

        console.log(`✅ Successfully added ${addedCount} new doctors.`);
        process.exit(0);
    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
};

addDoctors();
