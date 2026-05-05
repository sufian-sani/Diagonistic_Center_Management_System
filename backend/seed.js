import mongoose from "mongoose";
import bcrypt from "bcrypt";
import 'dotenv/config';
import doctorModel from "./models/doctorModel.js";

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI + '/prescripto');
        console.log("Connected to MongoDB for seeding...");

        // Clear existing doctors to avoid duplicates
        await doctorModel.deleteMany({});
        console.log("Cleared existing doctors");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("doctor123", salt);

        const doctors = [
            {
                name: "Dr. Richard James",
                email: "richard@prescripto.com",
                password: hashedPassword,
                image: "https://res.cloudinary.com/dvrzndk8z/image/upload/v1703666276/doc1_rqqj4n.png",
                speciality: "General physician",
                degree: "MBBS",
                experience: "4 Years",
                about: "Dr. Richard has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
                available: true,
                fees: 50,
                address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
                date: Date.now()
            },
            {
                name: "Dr. Emily Larson",
                email: "emily@prescripto.com",
                password: hashedPassword,
                image: "https://res.cloudinary.com/dvrzndk8z/image/upload/v1703666276/doc2_j8vzjv.png",
                speciality: "Gynecologist",
                degree: "MBBS",
                experience: "3 Years",
                about: "Dr. Emily focuses on female reproductive health and is dedicated to providing compassionate care for women at all stages of life.",
                available: true,
                fees: 60,
                address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
                date: Date.now()
            },
            {
                name: "Dr. Sarah Patel",
                email: "sarah@prescripto.com",
                password: hashedPassword,
                image: "https://res.cloudinary.com/dvrzndk8z/image/upload/v1703666276/doc3_v1wz9x.png",
                speciality: "Dermatologist",
                degree: "MBBS",
                experience: "1 Year",
                about: "Dr. Sarah specializes in diagnosing and treating skin, hair, and nail conditions. She is passionate about helping patients achieve healthy skin.",
                available: true,
                fees: 30,
                address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
                date: Date.now()
            },
            {
                name: "Dr. Christopher Lee",
                email: "christopher@prescripto.com",
                password: hashedPassword,
                image: "https://res.cloudinary.com/dvrzndk8z/image/upload/v1703666277/doc4_c7yxyq.png",
                speciality: "Pediatricians",
                degree: "MBBS",
                experience: "2 Years",
                about: "Dr. Christopher is dedicated to the health and well-being of infants, children, and adolescents. He provides comprehensive care from birth through young adulthood.",
                available: true,
                fees: 40,
                address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
                date: Date.now()
            },
            {
                name: "Dr. Timothy White",
                email: "timothy@prescripto.com",
                password: hashedPassword,
                image: "https://res.cloudinary.com/dvrzndk8z/image/upload/v1703666277/doc5_l2nixl.png",
                speciality: "Neurologist",
                degree: "MBBS",
                experience: "4 Years",
                about: "Dr. Timothy specializes in the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and nerves.",
                available: true,
                fees: 50,
                address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
                date: Date.now()
            }
        ];

        await doctorModel.insertMany(doctors);
        console.log("Successfully seeded 5 mock doctors!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding data:", error);
        mongoose.connection.close();
    }
};

seedDoctors();
