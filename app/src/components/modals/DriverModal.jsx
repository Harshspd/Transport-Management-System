import React, { useState } from 'react';
import { saveModalEntry } from '../../app/utils/api.js';

const DriverModal = ({ show, onClose, onAdd }) => {
    const [newOptionValue, setNewOptionValue] = useState('');
    const [formData, setFormData] = useState({});

    const closeModal = () => {
        setNewOptionValue('');
        setFormData({});
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, files, type: inputType } = e.target;
        if (inputType === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log('Form data updated:', { ...formData, [name]: value });
    };

    const handleAddNew = async () => {
        // Create entry with name from newOptionValue and other data from formData
        const entry = { name: newOptionValue, ...formData };
        console.log('Saving entry:', entry);

        const response = await saveModalEntry('Driver', entry);
        if (response.success) {
            onAdd('Driver', entry);
            closeModal();
        } else {
            alert('Error saving entry');
        }
    };

    const fields = [
        { label: 'Contact Number', name: 'contactNumber', type: 'text' },
        { label: 'License Number', name: 'licenseNumber', type: 'text' },
        { label: 'License Expiry', name: 'licenseExpiry', type: 'date' },
        { label: 'Address', name: 'address', type: 'textarea' }
    ];

    const renderField = (field) => {
        if (field.type === 'textarea') {
            return (
                <textarea
                    name={field.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-300 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20"
                    rows={4}
                ></textarea>
            );
        }
        if (field.type === 'file') {
            return (
                <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 dark:file:bg-brand-900/20 dark:file:text-brand-400 hover:file:bg-brand-100 dark:hover:file:bg-brand-900/30"
                />
            );
        }
        return (
            <input
                type={field.type}
                name={field.name}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-300 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20"
            />
        );
    };

    const getLeftFields = () => {
        return [
            { label: 'Driver Name', name: 'name', type: 'text' },
            ...fields.filter(f => f.name === 'address')
        ];
    };

    const getRightFields = () => {
        return fields.filter(f => f.name !== 'address');
    };

    return (
        <div className={`fixed top-17 right-0 w-1/2 h-full bg-white dark:bg-gray-900 shadow-xl z-50 transition-transform duration-500 ease-in-out ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Add Driver</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-thin text-2xl transition-colors">&times;</button>
                </div>

                <div className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
                    <h2 className="text-lg font-medium pb-4 text-gray-800 dark:text-white">Driver Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="flex flex-col gap-4">
                            {getLeftFields().map((field, idx) => {
                                if (field.name === 'name') {
                                    return (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{field.label} :</label>
                                            <input
                                                type="text"
                                                value={newOptionValue}
                                                onChange={(e) => {
                                                    setNewOptionValue(e.target.value);
                                                    console.log('Name field updated:', e.target.value);
                                                }}
                                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 h-10.5 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-brand-300 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:focus:ring-brand-500/20"
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{field.label} :</label>
                                        {renderField(field)}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col gap-4">
                            {getRightFields().map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">{field.label} :</label>
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>

                        {/* Save Button*/}
                        <div className="col-span-1 md:col-span-2">
                            <button
                                onClick={handleAddNew}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverModal; 