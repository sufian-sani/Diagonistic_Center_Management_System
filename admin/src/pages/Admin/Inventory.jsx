import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Inventory = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Reagent');
    const [stockLevel, setStockLevel] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [branch, setBranch] = useState('Main Branch');

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/inventory/all`, { headers: { aToken } });
            if (data.success) {
                setInventory(data.items);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (aToken) fetchInventory();
    }, [aToken]);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/inventory/add`, 
                { name, category, stockLevel, lowStockThreshold, branch }, 
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                setName(''); setStockLevel(0);
                fetchInventory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleUpdateStock = async (itemId, currentStock, change) => {
        const newStock = currentStock + change;
        if (newStock < 0) return;
        
        try {
            const { data } = await axios.post(`${backendUrl}/api/inventory/update-stock`, 
                { itemId, stockLevel: newStock }, 
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchInventory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (itemId) => {
        if(!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const { data } = await axios.post(`${backendUrl}/api/inventory/delete`, 
                { itemId }, 
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchInventory();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='flex justify-between items-center mb-8'>
                <div>
                    <h1 className='text-3xl font-extrabold text-slate-800 tracking-tight'>Inventory Management</h1>
                    <p className='text-slate-500 mt-1 font-light'>Manage medical supplies and reagents across branches.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className='px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors'
                >
                    + Add New Item
                </button>
            </motion.div>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin'></div>
                </div>
            ) : (
                <div className='bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden'>
                    <table className='w-full text-left'>
                        <thead className='bg-slate-50/80 border-b border-slate-100'>
                            <tr>
                                <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Item Name</th>
                                <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Category</th>
                                <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider'>Branch</th>
                                <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center'>Stock Level</th>
                                <th className='px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-50'>
                            {inventory.map((item, index) => {
                                const isLowStock = item.stockLevel <= item.lowStockThreshold;
                                return (
                                    <tr key={item._id} className={`hover:bg-slate-50/50 transition-colors ${isLowStock ? 'bg-red-50/30' : ''}`}>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLowStock ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'}`}>
                                                    {isLowStock ? '⚠️' : '📦'}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-lg ${isLowStock ? 'text-red-700' : 'text-slate-800'}`}>{item.name}</p>
                                                    {isLowStock && <p className='text-xs text-red-500 font-bold'>Low Stock Warning</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-slate-600 font-medium'>{item.category}</td>
                                        <td className='px-6 py-4 text-slate-500'>{item.branch}</td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-center gap-4'>
                                                <button onClick={() => handleUpdateStock(item._id, item.stockLevel, -1)} className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200'>-</button>
                                                <span className={`font-extrabold text-xl ${isLowStock ? 'text-red-600' : 'text-slate-700'}`}>{item.stockLevel}</span>
                                                <button onClick={() => handleUpdateStock(item._id, item.stockLevel, 1)} className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200'>+</button>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-right'>
                                            <button onClick={() => handleDelete(item._id)} className='text-red-500 hover:text-red-700 font-bold text-sm'>Remove</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {inventory.length === 0 && (
                        <div className='p-12 text-center text-slate-500 font-medium'>No inventory items found. Add one to get started.</div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4'>
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl'>
                        <h2 className='text-2xl font-bold text-slate-800 mb-6'>Add Inventory Item</h2>
                        <form onSubmit={handleAdd} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-bold text-slate-700 mb-1'>Item Name</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent' placeholder="e.g. Syringes 5ml"/>
                            </div>
                            <div>
                                <label className='block text-sm font-bold text-slate-700 mb-1'>Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-200'>
                                    <option>Reagent</option>
                                    <option>Consumable</option>
                                    <option>Equipment</option>
                                    <option>Medicine</option>
                                </select>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-bold text-slate-700 mb-1'>Initial Stock</label>
                                    <input required type="number" value={stockLevel} onChange={e => setStockLevel(Number(e.target.value))} className='w-full px-4 py-3 rounded-xl border border-slate-200'/>
                                </div>
                                <div>
                                    <label className='block text-sm font-bold text-slate-700 mb-1'>Low Threshold</label>
                                    <input required type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} className='w-full px-4 py-3 rounded-xl border border-slate-200'/>
                                </div>
                            </div>
                            <div>
                                <label className='block text-sm font-bold text-slate-700 mb-1'>Branch</label>
                                <select value={branch} onChange={e => setBranch(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-200'>
                                    <option>Main Branch</option>
                                    <option>North Clinic</option>
                                    <option>South Lab</option>
                                </select>
                            </div>
                            <div className='flex gap-4 mt-8'>
                                <button type="button" onClick={() => setShowModal(false)} className='flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors'>Cancel</button>
                                <button type="submit" className='flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30'>Add Item</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
