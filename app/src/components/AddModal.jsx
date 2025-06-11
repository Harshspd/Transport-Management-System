// import React, { useState } from 'react';
// import { saveModalEntry } from '../app/utils/api.js';

// const AddModal = ({ show, type, data, onClose, onChange, onAdd }) => {
//     const [newOptionValue, setNewOptionValue] = useState('');
//     const [formData, setFormData] = useState({});

//     const closeModal = () => {
//         setNewOptionValue('');
//         setFormData({});
//         onClose();
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleAddNew = async () => {
//         const entry = { name: newOptionValue, ...formData };
//         const response = await saveModalEntry(type, entry);
//         if (response.success) {
//             onAdd(type, entry);
//             closeModal();
//         } else {
//             alert('Error saving entry');
//         }
//     };

//     const renderOptions = (opts, category) => {
//         return opts.map((opt, index) => (
//             <option key={index} value={opt.name}>{opt.name}</option>
//         ));
//     };

//     if (!show) return null;

//         switch (type) {
//             case 'Consigner':
//                 return (
//                     <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
//                         <div className="p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-bold">Add Consigner</h2>
//                                 <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
//                             </div>
//                             <div className='p-4 rounded-lg border-15 border-gray-100'>
//                                 <h2 className="text-lg font-medium pb-4">Consigner Details</h2>

//                                 <div className='grid grid-cols-2 gap-4 '>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Consigner Name :</label>
//                                         <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Contact Person :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div className='row-span-2'>
//                                         <label className="block text-sm font-medium mb-1">Address :</label>
//                                         <textarea onChange={handleChange} className="w-full border rounded-lg p-2 h-32.5" ></textarea>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Contact Number :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">GST IN :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );

//             case 'Consignee':
//                 return (
//                     <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
//                         <div className="p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-bold">Add Consignee</h2>
//                                 <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
//                             </div>
//                             <div className='p-4 rounded-lg border-15 border-gray-100'>
//                                 <h2 className="text-lg font-medium pb-4">Consignee Details</h2>

//                                 <div className='grid grid-cols-2 gap-4 '>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Consignee Name :</label>
//                                         <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Contact Person :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div className='row-span-2'>
//                                         <label className="block text-sm font-medium mb-1">Address :</label>
//                                         <textarea onChange={handleChange} className="w-full border rounded-lg p-2 h-32.5" ></textarea>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Contact Number :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             case 'Driver':
//                 return (
//                     <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
//                         <div className="p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-bold">Add Driver</h2>
//                                 <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
//                             </div>
//                             <div className='p-4 rounded-lg border-15 border-gray-100'>
//                                 <h2 className="text-lg font-medium pb-4">Driver Details</h2>

//                                 <div className='grid grid-cols-2 gap-4 '>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Driver Name :</label>
//                                         <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Driver License Number :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div className='row-span-2'>
//                                         <label className="block text-sm font-medium mb-1">Address :</label>
//                                         <textarea onChange={handleChange} className="w-full border rounded-lg p-2 h-32.5" ></textarea>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Contact Number :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Upload License</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             case 'Vehicle':
//                 return (
//                     <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
//                         <div className="p-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h2 className="text-lg font-bold">Add Vehicle</h2>
//                                 <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
//                             </div>
//                             <div className='p-4 rounded-lg border-15 border-gray-100'>
//                                 <h2 className="text-lg font-medium pb-4">Vehicle Details</h2>

//                                 <div className='grid grid-cols-2 gap-4 '>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Vehicle Number :</label>
//                                         <input type="text" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Vehicle Type :</label>
//                                         <select name="Vehicle" onChange={handleChange} value={formData.Vehicle} className="w-full border rounded-lg p-2 h-10.5">
//                                             <option value="">Select</option>
//                                             {renderOptions(options.Vehicle, 'Vehicle')}
//                                         </select>
//                                     </div>
//                                     <div className='row-span-2'>
//                                         <label className="block text-sm font-medium mb-1">Capacity (Weight) :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">RC Number :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Capacity (Volume) :</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">Upload RC</label>
//                                         <input type="text" onChange={handleChange} className="w-full border rounded-lg p-2 h-10.5" />
//                                     </div>
//                                     <button onClick={handleAddNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     export default AddModal;


// components/AddModal.jsx
import React, { useState } from 'react';
import { saveModalEntry } from '../app/utils/api.js';

const AddModal = ({ show, type, data, onClose, onChange, onAdd }) => {
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
    };

    const handleAddNew = async () => {
        const entry = { name: newOptionValue, ...formData };
        const response = await saveModalEntry(type, entry);
        if (response.success) {
            onAdd(type, entry);
            closeModal();
        } else {
            alert('Error saving entry');
        }
    };

    if (!show) return null;

    const modalTitles = {
        Consigner: 'Consigner',
        Consignee: 'Consignee',
        Driver: 'Driver',
        Vehicle: 'Vehicle'
    };

    const fieldsByType = {
        Consigner: [
            { label: 'Contact Person', name: 'contactPerson', type: 'text' },
            { label: 'Address', name: 'address', type: 'textarea' },
            { label: 'Contact Number', name: 'contactNumber', type: 'text' },
            { label: 'GST IN', name: 'gstin', type: 'text' }
        ],
        Consignee: [
            { label: 'Contact Person', name: 'contactPerson', type: 'text' },
            { label: 'Address', name: 'address', type: 'textarea' },
            { label: 'Contact Number', name: 'contactNumber', type: 'text' }
        ],
        Driver: [
            { label: 'Driver License Number', name: 'licenseNumber', type: 'text' },
            { label: 'Address', name: 'address', type: 'textarea' },
            { label: 'Contact Number', name: 'contactNumber', type: 'text' },
            { label: 'Upload License', name: 'licenseUpload', type: 'file' }
        ],
        Vehicle: [
            { label: 'Vehicle Type', name: 'vehicleType', type: 'text' },
            { label: 'Capacity (Weight)', name: 'capacityWeight', type: 'text' },
            { label: 'RC Number', name: 'rcNumber', type: 'text' },
            { label: 'Capacity (Volume)', name: 'capacityVolume', type: 'text' },
            { label: 'Upload RC', name: 'rcUpload', type: 'file' }
        ]
    };

    const renderField = (field) => {
        if (field.type === 'textarea') {
            return (
                <textarea
                    name={field.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 h-32.5"
                ></textarea>
            );
        }
        if (field.type === 'file') {
            return (
                <input
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 h-10.5"
                />
            );
        }
        return (
            <input
                type={field.type}
                name={field.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 h-10.5"
            />
        );
    };

    return (
        <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Add {modalTitles[type]}</h2>
                    <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                </div>
                <div className='p-4 rounded-lg border-15 border-gray-100'>
                    <h2 className="text-lg font-medium pb-4">{modalTitles[type]} Details</h2>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className="block text-sm font-medium mb-1">{modalTitles[type]} Name :</label>
                            <input
                                type="text"
                                value={newOptionValue}
                                onChange={(e) => setNewOptionValue(e.target.value)}
                                className="w-full border rounded-lg p-2 h-10.5"
                            />
                        </div>
                        {fieldsByType[type]?.map((field, idx) => (
                            <div key={idx} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                <label className="block text-sm font-medium mb-1">{field.label} :</label>
                                {renderField(field)}
                            </div>
                        ))}
                        <button
                            onClick={handleAddNew}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-2"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddModal;
