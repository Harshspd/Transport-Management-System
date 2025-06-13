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
//         const { name, value, files, type: inputType } = e.target;
//         if (inputType === 'file') {
//             setFormData({ ...formData, [name]: files[0] });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
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

//     if (!show) return null;

//     const modalTitles = {
//         Consigner: 'Consigner',
//         Consignee: 'Consignee',
//         Driver: 'Driver',
//         Vehicle: 'Vehicle'
//     };

//     const fieldsByType = {
//         Consigner: [
//             { label: 'Contact Person', name: 'contactPerson', type: 'text' },
//             { label: 'Address', name: 'address', type: 'textarea' },
//             { label: 'Contact Number', name: 'contactNumber', type: 'text' },
//             { label: 'GST IN', name: 'gstin', type: 'text' }
//         ],
//         Consignee: [
//             { label: 'Contact Person', name: 'contactPerson', type: 'text' },
//             { label: 'Address', name: 'address', type: 'textarea' },
//             { label: 'Contact Number', name: 'contactNumber', type: 'text' }
//         ],
//         Driver: [
//             { label: 'Driver License Number', name: 'licenseNumber', type: 'text' },
//             { label: 'Address', name: 'address', type: 'textarea' },
//             { label: 'Contact Number', name: 'contactNumber', type: 'text' },
//             { label: 'Upload License', name: 'licenseUpload', type: 'file' }
//         ],
//         Vehicle: [
//             { label: 'Vehicle Type', name: 'vehicleType', type: 'text' },
//             { label: 'Capacity (Weight)', name: 'capacityWeight', type: 'text' },
//             { label: 'RC Number', name: 'rcNumber', type: 'text' },
//             { label: 'Capacity (Volume)', name: 'capacityVolume', type: 'text' },
//             { label: 'Upload RC', name: 'rcUpload', type: 'file' }
//         ]
//     };

//     const renderField = (field) => {
//         if (field.type === 'textarea') {
//             return (
//                 <textarea
//                     name={field.name}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg p-2 h-32.5"
//                 ></textarea>
//             );
//         }
//         if (field.type === 'file') {
//             return (
//                 <input
//                     type="file"
//                     name={field.name}
//                     onChange={handleChange}
//                     className="w-full border rounded-lg p-2 h-10.5"
//                 />
//             );
//         }
//         return (
//             <input
//                 type={field.type}
//                 name={field.name}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-2 h-10.5"
//             />
//         );
//     };

//     return (
//         <div className="fixed top-17 right-0 w-1/2 h-full bg-white shadow-xl z-50 transition-transform duration-300">
//             <div className="p-6">

//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-bold">Add {modalTitles[type]}</h2>
//                     <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
//                 </div>

//                 <div className='p-4 rounded-lg border-15 border-gray-100'>
//                     <h2 className="text-lg font-medium pb-4">{modalTitles[type]} Details</h2>

//                     {/* <div className='grid grid-cols-2 gap-4'>
//                         <div>
//                             <label className="block text-sm font-medium mb-1">{modalTitles[type]} Name :</label>
//                             <input
//                                 type="text"
//                                 value={newOptionValue}
//                                 onChange={(e) => setNewOptionValue(e.target.value)}
//                                 className="w-full border rounded-lg p-2 h-10.5"
//                             />
//                         </div>
//                         {fieldsByType[type]?.map((field, idx) => (
//                             <div key={idx} className={field.type === 'textarea' ? 'col-span-2' : ''}>
//                                 <label className="block text-sm font-medium mb-1">{field.label} :</label>
//                                 {renderField(field)}
//                             </div>
//                         ))}
//                         <button
//                             onClick={handleAddNew}
//                             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-2"
//                         >
//                             Save
//                         </button>
//                     </div> */}



                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                         <div>
//                             <label className="block text-sm font-medium mb-1">{modalTitles[type]} Name :</label>
//                             <input
//                                 type="text"
//                                 value={newOptionValue}
//                                 onChange={(e) => setNewOptionValue(e.target.value)}
//                                 className="w-full border rounded-lg p-2 h-10.5"
//                             />
//                         </div>


//                         {fieldsByType[type]?.map((field, idx) => (
//                             <div key={idx}>
//                                 <label className="block text-sm font-medium mb-1">{field.label} :</label>
//                                 {renderField(field)}
//                             </div>
//                         ))}


//                         <div className="md:col-span-2">
//                             <button
//                                 onClick={handleAddNew}
//                                 className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddModal;




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
            { label: 'Vehicle Number', name: 'vehicleNumber', type: 'text' },
            { label: 'Vehicle Type', name: 'vehicleType', type: 'select', options: ['Truck', 'Trailer', 'Pickup Truck', 'Van', 'Others'] },
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
                    className="w-full border rounded-lg p-2"
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

    const getLeftFields = () => {
        const allFields = fieldsByType[type] || [];

        if (['Consigner', 'Consignee', 'Driver'].includes(type)) {
            return [
                { label: `${modalTitles[type]} Name`, name: 'name', type: 'text' },
                ...allFields.filter(f => f.name === 'address')
            ];
        }

        return [];
    };

    const getRightFields = () => {
        const allFields = fieldsByType[type] || [];

        if (['Consigner', 'Consignee', 'Driver'].includes(type)) {
            return allFields.filter(f => f.name !== 'address');
        }

        return [];
    };

    return (
        <div className="fixed top-17 right-0 w-full md:w-1/2 h-full bg-white shadow-xl z-50 transition-transform duration-300 overflow-y-auto">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Add {modalTitles[type]}</h2>
                    <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                </div>

                <div className='p-4 rounded-lg border-15 border-gray-100'>
                    <h2 className="text-lg font-medium pb-4">{modalTitles[type]} Details</h2>

                    {type !== 'Vehicle' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="flex flex-col gap-4">
                                {getLeftFields().map((field, idx) => {
                                    if (field.name === 'name') {
                                        return (
                                            <div key={idx}>
                                                <label className="block text-sm font-medium mb-1">{field.label} :</label>
                                                <input
                                                    type="text"
                                                    value={newOptionValue}
                                                    onChange={(e) => setNewOptionValue(e.target.value)}
                                                    className="w-full border rounded-lg p-2 h-10.5"
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium mb-1">{field.label} :</label>
                                            {renderField(field)}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-4">
                                {getRightFields().map((field, idx) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium mb-1">{field.label} :</label>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>

                            {/* Save Button full width */}
                            <div className="col-span-1 md:col-span-2">
                                <button
                                    onClick={handleAddNew}
                                    className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Vehicle layout: all fields distributed equally */}
                            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fieldsByType[type].map((field, idx) => (
                                    <div key={idx}>
                                        <label className="block text-sm font-medium mb-1">{field.label} :</label>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>

                            {/* Save Button full width */}
                            <div className="col-span-2">
                                <button
                                    onClick={handleAddNew}
                                    className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddModal;
