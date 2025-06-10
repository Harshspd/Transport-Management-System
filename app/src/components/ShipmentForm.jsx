import React, { useEffect } from 'react'
import { useState } from 'react';
import AddModal from "@/components/AddModal"

export default function ShipmentForm() {
    const [formData, setFormData] = useState({
        Consigner: '',
        Consignee: '',
        DeliveryLocation: '',
        DateTime: '',
        Description: '',
        Quantity: '',
        BillNo: '',
        Value: '',
        Mode: '',
        ActualDimensions: '',
        ChargedDimensions: '',
        UnitWeight: '',
        ActualWeight: '',
        ChargedWeight: '',
        Instructions: '',
        Driver: '',
        Vehicle: '',
        ServiceType: '',
        Provider: '',
        EwayBill: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [newOptionValue, setNewOptionValue] = useState('');

    const [options, setOptions] = useState({
        Consigner: ['Reliance Industry', 'Tata New'],
        Consignee: ['Dell India', 'HP Pvt Lmt'],
        Mode: ['Transport', 'Door Delivery'],
        ServiceType: ['Standard', 'Express'],
        Driver: ['Balaji', 'Punith'],
        Vehicle: ['KA 23 V 6272', 'MH 20 U 5485'],
        // Vehicle: ['Truck', 'Trailer', 'Pickup Truck', 'Van', 'Others']
        Provider: ['Owner', 'Agency'],
        UnitWeight: ['Per Kg', 'LPT (Less than Truckload)', 'FTL (Turbo)', 'Turbo']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === '+Add new') {
            openModal(name);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const openModal = (type) => {
        setModalType(type);
        setNewOptionValue('');
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setNewOptionValue('');
        setModalType("");
    }

    const handleAddNew = () => {
        if (newOptionValue.trim()) {
            setOptions((prev) => ({
                ...prev,
                [modalType]: [...(prev[modalType] || []), newOptionValue.trim()]
            }));
            setFormData((prev) => ({ ...prev, [modalType]: newOptionValue.trim() }));
            closeModal();
        }
    };

    // const handleModalInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setNewModalData((prev) => ({ ...prev, [name]: value }));
    // };
    
    const renderOptions = (items) => (
        [
            ...items.map((item) => <option key={item} value={item}>{item}</option>),
            <option key="add-new" value="+Add new">+Add new</option>
        ]
    );

    useEffect(() => {
        const storedOptions = localStorage.getItem("shipmentOptions");
        if (storedOptions) {
            setOptions(JSON.parse(storedOptions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("shipmentOptions", JSON.stringify(options));
    }, [options]);
    

    return (
        <div>
            <h1 className="text-xl font-semibold pb-2">Shipment Booking</h1>
            <div className="grid grid-cols-[66%_34%] w-full gap-4">
                <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex gap-6 ">
                    {/* Left Form Section */}
                    <form className="flex-[3] space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-1">Consigner</label>
                            <select name="Consigner" onChange={handleChange} value={formData.Consigner} className="w-full border rounded-lg p-2 h-10.5">
                                <option value="" className="text-gray-300">Select</option>
                                {renderOptions(options.Consigner, 'Consigner')}
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Consignee</label>
                                <select name="Consignee" onChange={handleChange} value={formData.Consignee} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select</option>
                                    {renderOptions(options.Consignee, 'Consignee')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Delivery Location</label>
                                <input name="DeliveryLocation" onChange={handleChange} value={formData.DeliveryLocation} type="text" className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date/Time</label>
                                <input name="DateTime" onChange={handleChange} value={formData.DateTime} type="datetime-local" className="w-full border rounded-lg p-2" />
                            </div>
                        </div>

                        <h2 className="text-lg font-medium">Goods Details</h2>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="row-span-3">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea name="Description" onChange={handleChange} value={formData.Description} className="w-full border rounded-lg p-2 h-55" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity</label>
                                <input type='number' name="Quantity" onChange={handleChange} value={formData.Quantity} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bill No</label>
                                <input name="BillNo" onChange={handleChange} value={formData.BillNo} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input type='number' name="Value" onChange={handleChange} value={formData.Value} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mode</label>
                                <select name="Mode" onChange={handleChange} value={formData.Mode} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Mode</option>
                                    {renderOptions(options.Mode, 'Mode')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Actual Dimensions</label>
                                <input name="ActualDimensions" onChange={handleChange} value={formData.ActualDimensions} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Charged Dimensions</label>
                                <input name="ChargedDimensions" onChange={handleChange} value={formData.ChargedDimensions} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Unit of Weight</label>
                                <select name="UnitWeight" onChange={handleChange} value={formData.UnitWeight} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Unit</option>
                                    {renderOptions(options.UnitWeight, 'UnitWeight')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Actual Weight</label>
                                <input name="ActualWeight" onChange={handleChange} value={formData.ActualWeight} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Charged Weight</label>
                                <input name="ChargedWeight" onChange={handleChange} value={formData.ChargedWeight} className="w-full border rounded-lg p-2" />
                            </div>
                            <div className="row-span-3">
                                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                                <textarea name="Instructions" onChange={handleChange} value={formData.Instructions} className="w-full border rounded-lg p-2 h-55" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Driver</label>
                                <select name="Driver" onChange={handleChange} value={formData.Driver} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select</option>
                                    {renderOptions(options.Driver, 'Driver')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Vehicle</label>
                                <select name="Vehicle" onChange={handleChange} value={formData.Vehicle} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select</option>
                                    {renderOptions(options.Vehicle, 'Vehicle')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Type</label>
                                <select name="ServiceType" onChange={handleChange} value={formData.ServiceType} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Service Type</option>
                                    {renderOptions(options.ServiceType, 'ServiceType')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Provider</label>
                                <select name="Provider" onChange={handleChange} value={formData.Provider} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Provider Type</option>
                                    {renderOptions(options.Provider, 'Provider')}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Eway Bill Number</label>
                                <input name="EwayBill" onChange={handleChange} value={formData.EwayBill} className="w-full border rounded-lg p-2" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Book Shipment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Preview Section */}
                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="flex justify-center font-semibold text-lg mb-4">Preview</h2>
                    <div className="grid grid-cols-2 gap-2 space-y-2 bg-gray-100 p-6 rounded-lg">
                        {Object.entries(formData).map(([key, value]) => (
                            <p key={key} className="text-sm">{key.replace(/([A-Z])/g, ' $1')}: <strong> {value}</strong></p>
                        ))}
                    </div>
                </div>
            </div>
            {/* Slide-in Modal */}

            <AddModal
                show={showModal}
                type={modalType}
                data={newModalData}
                onClose={closeModal}
                onChange={handleModalInputChange}
                onAdd={handleAddNew}
            />
            {showModal && (
                <div className="fixed top-50 right-0 w-1/2 h-lg bg-white shadow-xl z-50 transition-transform duration-300">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
                            <button onClick={closeModal} className="text-gray-400 font-thin text-2xl">&times;</button>
                        </div>
                        <div className='p-4 rounded-lg border-15 border-gray-100'>
                            <h2 className="text-lg font-medium pb-4">{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Details</h2>

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
            )}
        </div>
    );
}
