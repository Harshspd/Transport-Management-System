import React, { useState } from 'react'

export default function AddModal({ show, type, data, onClose, onChange, onAdd }) {
    const [options, setOptions] = useState({
        Vehicle: ['Truck', 'Trailer', 'Pickup Truck', 'Van', 'Others']
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === '+Add new') {
            openModal(name);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const renderFields = () => {
        switch (type) {
            case 'Consigner':
                return (
                    <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Add Consigner</h2>
                                <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                            </div>
                            <div className='p-4 rounded-lg border-15 border-gray-100'>
                                <h2 className="text-lg font-medium pb-4">Consigner Details</h2>

                                <div className='grid grid-cols-2 gap-4 '>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Consigner Name :</label>
                                        <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Person :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div className='row-span-2'>
                                        <label className="block text-sm font-medium mb-1">Address :</label>
                                        <textarea onChange={handleChange} className="w-full border rounded-lg p-2 h-32.5" ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Number :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">GST IN :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Consignee':
                return (
                    <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Add Consignee</h2>
                                <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                            </div>
                            <div className='p-4 rounded-lg border-15 border-gray-100'>
                                <h2 className="text-lg font-medium pb-4">Consignee Details</h2>

                                <div className='grid grid-cols-2 gap-4 '>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Consignee Name :</label>
                                        <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Person :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div className='row-span-2'>
                                        <label className="block text-sm font-medium mb-1">Address :</label>
                                        <textarea onChange={handleChange} className="w-full border rounded-lg p-2 h-32.5" ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Number :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Driver':
                return (
                    <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Add Driver</h2>
                                <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                            </div>
                            <div className='p-4 rounded-lg border-15 border-gray-100'>
                                <h2 className="text-lg font-medium pb-4">Driver Details</h2>

                                <div className='grid grid-cols-2 gap-4 '>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Driver Name :</label>
                                        <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Driver License Number :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div className='row-span-2'>
                                        <label className="block text-sm font-medium mb-1">Address :</label>
                                        <textarea onChange={handleChange} className="w-full border rounded-lg p-2 h-32.5" ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Contact Number :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Upload License</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Vehicle':
                return (
                    <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Add Vehicle</h2>
                                <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                            </div>
                            <div className='p-4 rounded-lg border-15 border-gray-100'>
                                <h2 className="text-lg font-medium pb-4">Vehicle Details</h2>

                                <div className='grid grid-cols-2 gap-4 '>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Vehicle Number :</label>
                                        <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Vehicle Type :</label>
                                        <select name="Vehicle" onChange={handleChange} value={formData.Vehicle} className="w-full border rounded-lg p-2 h-10.5">
                                            <option value="">Select</option>
                                            {renderOptions(options.Vehicle, 'Vehicle')}
                                        </select>
                                    </div>
                                    <div className='row-span-2'>
                                        <label className="block text-sm font-medium mb-1">Capacity (Weight) :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">RC Number :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Capacity (Volume) :</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Upload RC</label>
                                        <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
                                    </div>
                                    <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <label>Value</label>
                        <input name="value" onChange={onChange} className="border p-2 w-full rounded mb-2" />
                    </>
                );
        }
    };

    return (
        <div className={`fixed top-0 right-0 w-1/2 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Add New {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                    <button onClick={onClose} className="text-red-500 font-bold text-xl">&times;</button>
                </div>
                {renderFields()}
                <button onClick={onAdd} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
            </div>
        </div>
    );
}
