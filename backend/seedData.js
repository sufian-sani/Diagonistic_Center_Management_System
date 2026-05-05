import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";
import staffModel from "./models/staffModel.js";
import userModel from "./models/userModel.js";
import appointmentModel from "./models/appointmentModel.js";
import 'dotenv/config';

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database Connected for Seeding");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // ─── DOCTORS ───────────────────────────────────────────────────────────
        const doctorData = [
            {
                name: "Dr. Ayasha Chowdhury",
                email: "doctor@example.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                speciality: "General physician",
                degree: "MBBS, FCPS",
                medicalCollege: "Dhaka Medical College, University of Dhaka",
                experience: "8 Years",
                about: "Dr. Ayasha Chowdhury is a highly experienced general physician committed to providing comprehensive, patient-centered care. She focuses on preventive medicine and lifestyle management.",
                fees: 60,
                available: true,
                address: { line1: "House 12, Road 4", line2: "Dhanmondi, Dhaka 1205" },
                date: Date.now() - 8000000000
            },
            {
                name: "Dr. Rafiq Hossain",
                email: "dr.rafiq@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                speciality: "Cardiologist",
                degree: "MBBS, MD (Cardiology)",
                medicalCollege: "Sir Salimullah Medical College, Dhaka",
                experience: "15 Years",
                about: "Dr. Rafiq Hossain is a leading cardiologist with over 15 years of experience treating complex heart conditions. He has pioneered minimally invasive cardiac procedures at Healing Heaven.",
                fees: 150,
                available: true,
                address: { line1: "Block B, Floor 3", line2: "Gulshan-2, Dhaka 1212" },
                date: Date.now() - 7000000000
            },
            {
                name: "Dr. Nadia Islam",
                email: "dr.nadia@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/women/55.jpg",
                speciality: "Neurologist",
                degree: "MBBS, MD (Neurology)",
                medicalCollege: "Mymensingh Medical College, BAU",
                experience: "12 Years",
                about: "Dr. Nadia Islam specializes in neurological disorders including epilepsy, stroke, and migraines. She uses the latest diagnostic technologies to deliver precise treatment.",
                fees: 130,
                available: true,
                address: { line1: "Plot 7, Sector 4", line2: "Uttara, Dhaka 1230" },
                date: Date.now() - 6000000000
            },
            {
                name: "Dr. Karim Ahmed",
                email: "dr.karim@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/men/45.jpg",
                speciality: "Orthopedic",
                degree: "MBBS, MS (Orthopedic Surgery)",
                medicalCollege: "Chittagong Medical College, University of Chittagong",
                experience: "10 Years",
                about: "Dr. Karim Ahmed is an orthopedic surgeon with a focus on sports injuries, joint replacements, and spinal disorders. He is known for his exceptional surgical precision.",
                fees: 120,
                available: true,
                address: { line1: "House 45, Road 11", line2: "Banani, Dhaka 1213" },
                date: Date.now() - 5000000000
            },
            {
                name: "Dr. Priya Sen",
                email: "dr.priya@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/women/68.jpg",
                speciality: "Pediatrician",
                degree: "MBBS, DCH",
                medicalCollege: "Rajshahi Medical College, University of Rajshahi",
                experience: "9 Years",
                about: "Dr. Priya Sen is a compassionate pediatrician dedicated to the health and wellbeing of children from birth through adolescence. She has a special interest in developmental pediatrics.",
                fees: 80,
                available: true,
                address: { line1: "Road 5, Block C", line2: "Mirpur-10, Dhaka 1216" },
                date: Date.now() - 4000000000
            },
            {
                name: "Dr. Zaman Khan",
                email: "dr.zaman@healingheaven.com",
                password: hashedPassword,
                image: "https://randomuser.me/api/portraits/men/76.jpg",
                speciality: "Dermatologist",
                degree: "MBBS, DDV",
                medicalCollege: "Sylhet MAG Osmani Medical College, University of Sylhet",
                experience: "7 Years",
                about: "Dr. Zaman Khan is a skilled dermatologist specializing in skin, hair, and nail disorders. He is experienced in both medical and cosmetic dermatology procedures.",
                fees: 90,
                available: false,
                address: { line1: "Shop 3, Concord Tower", line2: "Mohakhali, Dhaka 1212" },
                date: Date.now() - 3000000000
            }
        ];

        const doctorDocs = [];
        for (const doc of doctorData) {
            const exists = await doctorModel.findOne({ email: doc.email });
            if (!exists) {
                const newDoc = new doctorModel(doc);
                const saved = await newDoc.save();
                doctorDocs.push(saved);
                console.log(`   👨‍⚕️ Doctor seeded: ${doc.name}`);
            } else {
                doctorDocs.push(exists);
                console.log(`   ⚠️  Doctor already exists: ${doc.name}`);
            }
        }

        // ─── STAFF ──────────────────────────────────────────────────────────────
        const staffData = [
            { name: "John Rahman", email: "labtech@example.com", password: hashedPassword, role: "Lab Technician" },
            { name: "Jane Begum", email: "receptionist@example.com", password: hashedPassword, role: "Receptionist" },
            { name: "Tariq Molla", email: "labtech2@healingheaven.com", password: hashedPassword, role: "Lab Technician" },
            { name: "Sadia Akter", email: "reception2@healingheaven.com", password: hashedPassword, role: "Receptionist" },
        ];

        for (const s of staffData) {
            const exists = await staffModel.findOne({ email: s.email });
            if (!exists) {
                const newStaff = new staffModel({ ...s, date: Date.now() });
                await newStaff.save();
                console.log(`   🧑‍💼 Staff seeded: ${s.name} (${s.role})`);
            } else {
                console.log(`   ⚠️  Staff already exists: ${s.name}`);
            }
        }

        // ─── PATIENTS ───────────────────────────────────────────────────────────
        const patientData = [
            { name: "Mehedi Hassan", email: "mehedi@example.com", password: hashedPassword, phone: "01712345678", gender: "Male", dob: "1990-03-15", address: { line1: "House 23, Road 7", line2: "Mohammadpur, Dhaka" }, image: "https://randomuser.me/api/portraits/men/11.jpg" },
            { name: "Farida Yasmin", email: "farida@example.com", password: hashedPassword, phone: "01812345679", gender: "Female", dob: "1985-07-22", address: { line1: "Flat 5B, Shanti Nagar", line2: "Khilgaon, Dhaka" }, image: "https://randomuser.me/api/portraits/women/22.jpg" },
            { name: "Rahim Uddin", email: "rahim@example.com", password: hashedPassword, phone: "01912345680", gender: "Male", dob: "1978-11-08", address: { line1: "Village: Shibganj", line2: "Chapai Nawabganj" }, image: "https://randomuser.me/api/portraits/men/33.jpg" },
            { name: "Nasrin Akter", email: "nasrin@example.com", password: hashedPassword, phone: "01612345681", gender: "Female", dob: "1995-01-30", address: { line1: "Apt 3A, Palm Gardens", line2: "Bashundhara R/A, Dhaka" }, image: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "Sohel Rana", email: "sohel@example.com", password: hashedPassword, phone: "01512345682", gender: "Male", dob: "2001-06-14", address: { line1: "Road 12, House 5", line2: "Uttara Sector-7, Dhaka" }, image: "https://randomuser.me/api/portraits/men/55.jpg" },
            { name: "Rumana Khanam", email: "rumana@example.com", password: hashedPassword, phone: "01312345683", gender: "Female", dob: "1969-09-05", address: { line1: "Plot 8, Lake Drive", line2: "Gulshan-1, Dhaka" }, image: "https://randomuser.me/api/portraits/women/66.jpg" },
            { name: "Jamal Uddin", email: "jamal@example.com", password: hashedPassword, phone: "01412345684", gender: "Male", dob: "1982-12-20", address: { line1: "House 7, Shyamoli", line2: "Dhaka 1207" }, image: "https://randomuser.me/api/portraits/men/77.jpg" },
            { name: "Kabita Roy", email: "kabita@example.com", password: hashedPassword, phone: "01712345685", gender: "Female", dob: "1992-04-17", address: { line1: "2/4 Lalbagh Road", line2: "Old Dhaka" }, image: "https://randomuser.me/api/portraits/women/88.jpg" },
        ];

        const patientDocs = [];
        for (const p of patientData) {
            const exists = await userModel.findOne({ email: p.email });
            if (!exists) {
                const newPatient = new userModel(p);
                const saved = await newPatient.save();
                patientDocs.push(saved);
                console.log(`   🧑‍🤝‍🧑 Patient seeded: ${p.name}`);
            } else {
                patientDocs.push(exists);
                console.log(`   ⚠️  Patient already exists: ${p.name}`);
            }
        }

        // ─── APPOINTMENTS ────────────────────────────────────────────────────────
        if (patientDocs.length > 0 && doctorDocs.length > 0) {
            const appointmentCount = await appointmentModel.countDocuments();
            if (appointmentCount < 5) {
                const appointmentsToCreate = [
                    { userId: patientDocs[0]._id, docId: doctorDocs[0]._id, slotDate: "24_4_2025", slotTime: "09:00 am", amount: 60, isCompleted: true, cancelled: false, payment: true },
                    { userId: patientDocs[1]._id, docId: doctorDocs[1]._id, slotDate: "25_4_2025", slotTime: "11:00 am", amount: 150, isCompleted: false, cancelled: false, payment: true },
                    { userId: patientDocs[2]._id, docId: doctorDocs[2]._id, slotDate: "25_4_2025", slotTime: "02:00 pm", amount: 130, isCompleted: false, cancelled: true, payment: false },
                    { userId: patientDocs[3]._id, docId: doctorDocs[3]._id, slotDate: "26_4_2025", slotTime: "10:00 am", amount: 120, isCompleted: false, cancelled: false, payment: true },
                    { userId: patientDocs[4]._id, docId: doctorDocs[4]._id, slotDate: "26_4_2025", slotTime: "03:00 pm", amount: 80, isCompleted: false, cancelled: false, payment: false },
                    { userId: patientDocs[5]._id, docId: doctorDocs[0]._id, slotDate: "27_4_2025", slotTime: "09:30 am", amount: 60, isCompleted: false, cancelled: false, payment: true },
                    { userId: patientDocs[6]._id, docId: doctorDocs[1]._id, slotDate: "27_4_2025", slotTime: "01:00 pm", amount: 150, isCompleted: false, cancelled: false, payment: false },
                    { userId: patientDocs[7]._id, docId: doctorDocs[5]._id, slotDate: "28_4_2025", slotTime: "04:00 pm", amount: 90, isCompleted: false, cancelled: false, payment: true },
                    { userId: patientDocs[0]._id, docId: doctorDocs[2]._id, slotDate: "28_4_2025", slotTime: "10:30 am", amount: 130, isCompleted: false, cancelled: false, payment: false },
                    { userId: patientDocs[2]._id, docId: doctorDocs[3]._id, slotDate: "29_4_2025", slotTime: "11:30 am", amount: 120, isCompleted: false, cancelled: false, payment: true },
                    { userId: patientDocs[4]._id, docId: doctorDocs[0]._id, slotDate: "29_4_2025", slotTime: "02:30 pm", amount: 60, isCompleted: false, cancelled: false, payment: false },
                    { userId: patientDocs[1]._id, docId: doctorDocs[4]._id, slotDate: "30_4_2025", slotTime: "09:00 am", amount: 80, isCompleted: false, cancelled: false, payment: true },
                ];

                for (const appt of appointmentsToCreate) {
                    const doctor = doctorDocs.find(d => d._id.toString() === appt.docId.toString());
                    const patient = patientDocs.find(p => p._id.toString() === appt.userId.toString());
                    
                    const newAppt = new appointmentModel({
                        ...appt,
                        docData: {
                            _id: doctor._id, name: doctor.name, image: doctor.image,
                            speciality: doctor.speciality, fees: doctor.fees,
                            address: doctor.address, degree: doctor.degree
                        },
                        userData: {
                            _id: patient._id, name: patient.name,
                            image: patient.image || "", email: patient.email,
                            phone: patient.phone || "", gender: patient.gender || "Not Selected",
                            dob: patient.dob || "Not Selected", address: patient.address || {}
                        },
                        date: Date.now()
                    });
                    await newAppt.save();
                }
                console.log(`   📅 ${appointmentsToCreate.length} appointments seeded`);
            } else {
                console.log(`   ⚠️  Appointments already exist (${appointmentCount}), skipping`);
            }
        }

        console.log("\n✅ ════════ SEEDING COMPLETE ════════");
        console.log("┌─────────────────────────────────────┐");
        console.log("│  ADMIN         admin@example.com    │");
        console.log("│  Password:     greatstack123        │");
        console.log("├─────────────────────────────────────┤");
        console.log("│  DOCTOR        doctor@example.com   │");
        console.log("│  Password:     password123          │");
        console.log("├─────────────────────────────────────┤");
        console.log("│  LAB TECH      labtech@example.com  │");
        console.log("│  Password:     password123          │");
        console.log("├─────────────────────────────────────┤");
        console.log("│  RECEPTION     receptionist@...com  │");
        console.log("│  Password:     password123          │");
        console.log("└─────────────────────────────────────┘");
        process.exit(0);
    } catch (error) {
        console.log("❌ Error Seeding Data:", error);
        process.exit(1);
    }
};

seedData();
