import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import doctorModel from './models/doctorModel.js';
import 'dotenv/config';

const specialties = [
    'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 
    'Neurologist', 'Gastroenterologist', 'Psychiatrist', 'Cardiologist', 
    'Orthopedist', 'Urologist', 'Ophthalmologist'
];

const targetHigher = ['Psychiatrist', 'Cardiologist', 'Orthopedist', 'Urologist', 'Ophthalmologist'];

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getRandomDays = () => {
    const numDays = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    const shuffled = [...days].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numDays);
};

const firstNames = ["Zubayer", "Nusrat", "Arif", "Jahan", "Tanvir", "Sultana", "Fahad", "Nargis", "Sabbir", "Mehnaz", "Imran", "Farah", "Saif", "Sadia"];
const lastNames = ["Khanam", "Talukder", "Miah", "Patwary", "Bhuiyan", "Siddique", "Akand", "Molla", "Dewan", "Bari"];

const generateName = () => {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `Dr. ${f} ${l}`;
};

const seedMore = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database");
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        console.log("\nAdding more doctors for targeted specialties...");
        for (const spec of specialties) {
            const target = targetHigher.includes(spec) ? 5 : 2;
            const count = await doctorModel.countDocuments({ speciality: spec });
            console.log(`${spec}: Current ${count}, Target ${target}`);
            
            if (count < target) {
                const needed = target - count;
                for (let i = 0; i < needed; i++) {
                    const name = generateName();
                    const email = `dr.${name.toLowerCase().replace('dr. ', '').replace(' ', '.')}.${Math.floor(Math.random()*1000)}@sheba.com`;
                    const gender = Math.random() > 0.5 ? 'men' : 'women';
                    
                    const newDoc = new doctorModel({
                        name,
                        email,
                        password: hashedPassword,
                        image: `https://randomuser.me/api/portraits/${gender}/${Math.floor(Math.random() * 90)}.jpg`,
                        speciality: spec,
                        degree: "MBBS, MD, FCPS",
                        experience: `${Math.floor(Math.random() * 15) + 5} Years`,
                        about: `${name} is a senior consultant in ${spec} with extensive clinical experience at Sheba Diagnostic Center.`,
                        fees: 100 + Math.floor(Math.random() * 100),
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
        
        console.log("\nDoctor expansion complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedMore();
