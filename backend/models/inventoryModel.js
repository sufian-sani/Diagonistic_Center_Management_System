import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    stockLevel: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    branch: { type: String, required: true, default: "Main Branch" },
    lastUpdated: { type: Date, default: Date.now }
});

const inventoryModel = mongoose.models.inventory || mongoose.model("inventory", inventorySchema);
export default inventoryModel;
