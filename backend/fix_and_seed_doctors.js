import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import doctorModel from './models/doctorModel.js';
import 'dotenv/config';

const specialties = [
    'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 
    'Neurologist', 'Gastroenterologist', 'Psychiatrist', 'Cardiologist', 
    'Orthopedist', 'Urologist', 'Ophthalmologist'
];

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getRandomDays = () => {
    const numDays = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const shuffled = [...days].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numDays);
};

const firstNames = ["Anika", "Sajid", "Tania", "Mahir", "Ishrat", "Zayan", "Nafisa", "Areez", "Sumaiya", "Rohan"];
const lastNames = ["Rahman", "Islam", "Khan", "Ahmed", "Chowdhury", "Hossain", "Uddin", "Ali", "Haque", "Sarker"];

const generateName = () => {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `Dr. ${f} ${l}`;
};

const fixAndSeed = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log("Connected to Database");
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // 1. Fix existing doctors
        console.log("Fixing existing doctors...");
        const allDoctors = await doctorModel.find({});
        for (const doc of allDoctors) {
            let spec = doc.speciality;
            // Map common variants to standard names
            if (spec === 'Orthopedic') spec = 'Orthopedist';
            if (spec === 'Pediatrician') spec = 'Pediatricians';
            if (spec === 'ENT Specialist') spec = 'General physician'; // Map unknown to General
            
            doc.speciality = spec;
            doc.availableDays = getRandomDays();
            await doc.save();
            console.log(`Updated: ${doc.name} - ${doc.speciality} (${doc.availableDays.length} days)`);
        }

        // 2. Ensure 2 per specialty
        console.log("\nChecking doctor counts per specialty...");
        for (const spec of specialties) {
            const count = await doctorModel.countDocuments({ speciality: spec });
            console.log(`${spec}: ${count}`);
            
            if (count < 2) {
                const needed = 2 - count;
                for (let i = 0; i < needed; i++) {
                    const name = generateName();
                    const email = `dr.${name.toLowerCase().replace('dr. ', '').replace(' ', '.')}${Math.floor(Math.random()*100)}@sheba.com`;
                    const gender = Math.random() > 0.5 ? 'men' : 'women';
                    
                    const newDoc = new doctorModel({
                        name,
                        email,
                        password: hashedPassword,
                        image: `https://randomuser.me/api/portraits/${gender}/${Math.floor(Math.random() * 90)}.jpg`,
                        speciality: spec,
                        degree: "MBBS, MD",
                        experience: `${Math.floor(Math.random() * 10) + 5} Years`,
                        about: `${name} is a highly skilled specialist in ${spec}, providing world-class healthcare at Sheba Diagnostic Center.`,
                        fees: 80 + Math.floor(Math.random() * 70),
                        available: true,
                        address: { line1: "Sheba Diagnostic Center", line2: "Dhanmondi, Dhaka" },
                        date: Date.now(),
                        availableDays: getRandomDays()
                    });
                    await newDoc.save();
                    console.log(`   ✅ Added: ${name} for ${spec}`);
                }
            }
        }
        
        console.log("\nDoctor data synchronization complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixAndSeed();
