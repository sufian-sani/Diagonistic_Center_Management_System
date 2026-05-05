import inventoryModel from "../models/inventoryModel.js";

const addItem = async (req, res) => {
    try {
        const { name, category, stockLevel, lowStockThreshold, branch } = req.body;
        const newItem = new inventoryModel({ name, category, stockLevel, lowStockThreshold, branch });
        await newItem.save();
        res.json({ success: true, message: "Item added to inventory" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const getInventory = async (req, res) => {
    try {
        const items = await inventoryModel.find({});
        res.json({ success: true, items });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const updateStock = async (req, res) => {
    try {
        const { itemId, stockLevel } = req.body;
        await inventoryModel.findByIdAndUpdate(itemId, { stockLevel, lastUpdated: Date.now() });
        res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.body;
        await inventoryModel.findByIdAndDelete(itemId);
        res.json({ success: true, message: "Item removed from inventory" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export { addItem, getInventory, updateStock, deleteItem }
