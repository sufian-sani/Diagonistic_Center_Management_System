import mongoose from 'mongoose';
import inventoryModel from './models/inventoryModel.js';
import 'dotenv/config';

const inventoryData = [
    // North Clinic Items
    { name: "3M Littmann Stethoscope", category: "Diagnostic Tool", stockLevel: 25, lowStockThreshold: 5, branch: "North Clinic" },
    { name: "Digital Thermometer", category: "Diagnostic Tool", stockLevel: 150, lowStockThreshold: 20, branch: "North Clinic" },
    { name: "Surgical Masks (Box of 50)", category: "Consumable", stockLevel: 500, lowStockThreshold: 50, branch: "North Clinic" },
    { name: "Nitrile Gloves (Box of 100)", category: "Consumable", stockLevel: 300, lowStockThreshold: 30, branch: "North Clinic" },
    { name: "5ml Syringes", category: "Consumable", stockLevel: 1000, lowStockThreshold: 100, branch: "North Clinic" },
    { name: "Omron BP Monitor", category: "Diagnostic Tool", stockLevel: 15, lowStockThreshold: 3, branch: "North Clinic" },
    
    // South Lab Items
    { name: "Vacuum Test Tubes", category: "Labware", stockLevel: 2000, lowStockThreshold: 200, branch: "South Lab" },
    { name: "Hematology Reagent", category: "Reagent", stockLevel: 45, lowStockThreshold: 10, branch: "South Lab" },
    { name: "Centrifuge Tubes 15ml", category: "Labware", stockLevel: 800, lowStockThreshold: 80, branch: "South Lab" },
    { name: "Microscopic Slides (Pack of 72)", category: "Labware", stockLevel: 120, lowStockThreshold: 15, branch: "South Lab" },
    { name: "Adjustable Pipette (100-1000ul)", category: "Lab Equipment", stockLevel: 10, lowStockThreshold: 2, branch: "South Lab" },
    { name: "Blood Culture Bottles", category: "Labware", stockLevel: 250, lowStockThreshold: 40, branch: "South Lab" }
];

const seedInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database");

        // Clear existing for these branches to avoid duplicates if re-run
        await inventoryModel.deleteMany({ branch: { $in: ["North Clinic", "South Lab"] } });

        await inventoryModel.insertMany(inventoryData);
        console.log("Inventory Seeded Successfully for North Clinic and South Lab!");
        
        process.exit(0);
    } catch (error) {
        console.error("Error Seeding Inventory:", error);
        process.exit(1);
    }
};

seedInventory();
