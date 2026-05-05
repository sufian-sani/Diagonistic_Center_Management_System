import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    mongoose.connection.on('error', (err) => console.log("Database connection error:", err.message))

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
    } catch (error) {
        console.log("⚠️  MongoDB connection failed:", error.message)
        console.log("⚠️  Server running WITHOUT database. Please update MONGODB_URI in backend/.env")
    }
}

export default connectDB;

// Do not use '@' symbol in your database user's password else it will show an error.