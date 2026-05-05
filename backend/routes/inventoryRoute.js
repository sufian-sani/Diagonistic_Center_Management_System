import express from 'express';
import { addItem, getInventory, updateStock, deleteItem } from '../controllers/inventoryController.js';
import authAdmin from '../middleware/authAdmin.js';

const inventoryRouter = express.Router();

inventoryRouter.post('/add', authAdmin, addItem);
inventoryRouter.get('/all', authAdmin, getInventory);
inventoryRouter.post('/update-stock', authAdmin, updateStock);
inventoryRouter.post('/delete', authAdmin, deleteItem);

export default inventoryRouter;
