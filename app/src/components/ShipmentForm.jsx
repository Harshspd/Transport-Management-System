'use client';
import React, { useEffect } from 'react'
import { useState } from 'react';
import AddModal from "@/components/AddModal"

const ShipmentForm = () => {
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

    
    const [newModalData, setNewModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [errors, setErrors] = useState({});

    const [options, setOptions] = useState({
        Consigner: ['Reliance Industry', 'Tata New'],
        Consignee: ['Dell India', 'HP Pvt Lmt'],
        Mode: ['Transport', 'Door Delivery'],
        ServiceType: ['Standard', 'Express'],
        Driver: ['Balaji', 'Punith'],
        Vehicle: ['KA 23 V 6272', 'MH 20 U 5485'],
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Consigner) newErrors.Consigner = 'Consigner is required';
        if (!formData.Consignee) newErrors.Consignee = 'Consignee is required';
        if (!formData.DeliveryLocation) newErrors.DeliveryLocation = 'Delivery Location is required';
        if (!formData.DateTime) newErrors.DateTime = 'Date/Time is required';
        if (!formData.Description) newErrors.Description = 'Description is required';
        if (!formData.Quantity) newErrors.Quantity = 'Quantity is required';
        if (!formData.BillNo) newErrors.BillNo = 'Bill No is required';
        if (!formData.Value) newErrors.Value = 'Value is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const allShipments = JSON.parse(localStorage.getItem('shipments')) || [];
        allShipments.push(formData);
        localStorage.setItem('shipments', JSON.stringify(allShipments));

        console.log('Shipment saved:', formData);
        alert("Shipment booked successfully!");

        setFormData({
            Consigner: '', Consignee: '', DeliveryLocation: '', DateTime: '',
            Description: '', Quantity: '', BillNo: '', Value: '', Mode: '',
            ActualDimensions: '', ChargedDimensions: '', UnitWeight: '',
            ActualWeight: '', ChargedWeight: '', Instructions: '', Driver: '',
            Vehicle: '', ServiceType: '', Provider: '', EwayBill: '',
        });
    };

    const openModal = (type) => {
        setModalType(type);
        setNewModalData({});
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setNewModalData({});
        setModalType("");
    }

    const handleAddNew = (type, newEntry) => {
        if (newEntry?.name?.trim()) {
            setOptions((prev) => ({
                ...prev,
                [type]: [...(prev[type] || []), newEntry.name.trim()]
            }));
            setFormData((prev) => ({ ...prev, [type]: newEntry.name.trim() }));
            closeModal();
        } else {
            alert("Please fill all required fields");
        }
    };

    const handleModalInputChange = (e) => {
        const { name, value } = e.target;
        if (!modalType) return;
        setNewModalData((prev) => ({ ...prev, [modalType]: { ...prev[modalType], [name]: value } }));
    };

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
    
    const formatValue = (value) => {
        if (!value) return "";

        const date = new Date(value);
        if (isNaN(date)) return "";

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
        const formattedHours = String(hours).padStart(2, "0");

        return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        console.log("ShipmentForm loaded");
    }, []);

    const isFormValid = Object.values(formData).some(value => value);

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
                            {errors.Consigner && <p className="text-red-500 text-xs mt-1">{errors.Consigner}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Consignee</label>
                                <select name="Consignee" onChange={handleChange} value={formData.Consignee} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select</option>
                                    {renderOptions(options.Consignee, 'Consignee')}
                                </select>
                                {errors.Consignee && <p className="text-red-500 text-xs mt-1">{errors.Consignee}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Delivery Location</label>
                                <input name="DeliveryLocation" onChange={handleChange} value={formData.DeliveryLocation} type="text" className="w-full border rounded-lg p-2" />
                                {errors.DeliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.DeliveryLocation}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date/Time</label>
                                <input name="DateTime" onChange={handleChange} value={formData.DateTime} type="datetime-local" className="w-full border rounded-lg p-2" />
                                {errors.DateTime && <p className="text-red-500 text-xs mt-1">{errors.DateTime}</p>}
                            </div>
                        </div>

                        <h2 className="text-lg font-medium">Goods Details</h2>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="row-span-3">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea name="Description" onChange={handleChange} value={formData.Description} className="w-full border rounded-lg p-2 h-55" />
                                {errors.Description && <p className="text-red-500 text-xs mt-1">{errors.Description}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity</label>
                                <input type='number' name="Quantity" onChange={handleChange} value={formData.Quantity} className="w-full border rounded-lg p-2" />
                                {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bill No</label>
                                <input name="BillNo" onChange={handleChange} value={formData.BillNo} className="w-full border rounded-lg p-2" />
                                {errors.BillNo && <p className="text-red-500 text-xs mt-1">{errors.BillNo}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input type='number' name="Value" onChange={handleChange} value={formData.Value} className="w-full border rounded-lg p-2" />
                                {errors.Value && <p className="text-red-500 text-xs mt-1">{errors.Value}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mode</label>
                                <select name="Mode" onChange={handleChange} value={formData.Mode} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Mode</option>
                                    {renderOptions(options.Mode, 'Mode')}
                                </select>
                                {errors.Mode && <p className="text-red-500 text-xs mt-1">{errors.Mode}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Actual Dimensions</label>
                                <input name="ActualDimensions" onChange={handleChange} value={formData.ActualDimensions} className="w-full border rounded-lg p-2" />
                                {errors.ActualDimensions && <p className="text-red-500 text-xs mt-1">{errors.ActualDimensions}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Charged Dimensions</label>
                                <input name="ChargedDimensions" onChange={handleChange} value={formData.ChargedDimensions} className="w-full border rounded-lg p-2" />
                                {errors.ChargedDimensions && <p className="text-red-500 text-xs mt-1">{errors.ChargedDimensions}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Unit of Weight</label>
                                <select name="UnitWeight" onChange={handleChange} value={formData.UnitWeight} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Unit</option>
                                    {renderOptions(options.UnitWeight, 'UnitWeight')}
                                </select>
                                {errors.UnitWeight && <p className="text-red-500 text-xs mt-1">{errors.UnitWeight}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Actual Weight</label>
                                <input name="ActualWeight" onChange={handleChange} value={formData.ActualWeight} className="w-full border rounded-lg p-2" />
                                {errors.ActualWeight && <p className="text-red-500 text-xs mt-1">{errors.ActualWeight}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Charged Weight</label>
                                <input name="ChargedWeight" onChange={handleChange} value={formData.ChargedWeight} className="w-full border rounded-lg p-2" />
                                {errors.ChargedWeight && <p className="text-red-500 text-xs mt-1">{errors.ChargedWeight}</p>}
                            </div>
                            <div className="row-span-3">
                                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                                <textarea name="Instructions" onChange={handleChange} value={formData.Instructions} className="w-full border rounded-lg p-2 h-55" />
                                {errors.Instructions && <p className="text-red-500 text-xs mt-1">{errors.Instructions}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Driver</label>
                                <select name="Driver" onChange={handleChange} value={formData.Driver} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select</option>
                                    {renderOptions(options.Driver, 'Driver')}
                                </select>
                                {errors.Driver && <p className="text-red-500 text-xs mt-1">{errors.Driver}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Vehicle</label>
                                <select name="Vehicle" onChange={handleChange} value={formData.Vehicle} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select</option>
                                    {renderOptions(options.Vehicle, 'Vehicle')}
                                </select>
                                {errors.Vehicle && <p className="text-red-500 text-xs mt-1">{errors.Vehicle}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Type</label>
                                <select name="ServiceType" onChange={handleChange} value={formData.ServiceType} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Service Type</option>
                                    {renderOptions(options.ServiceType, 'ServiceType')}
                                </select>
                                {errors.ServiceType && <p className="text-red-500 text-xs mt-1">{errors.ServiceType}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Provider</label>
                                <select name="Provider" onChange={handleChange} value={formData.Provider} className="w-full border rounded-lg p-2 h-10.5">
                                    <option value="">Select Provider Type</option>
                                    {renderOptions(options.Provider, 'Provider')}
                                </select>
                                {errors.Provider && <p className="text-red-500 text-xs mt-1">{errors.Provider}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Eway Bill Number</label>
                                <input name="EwayBill" onChange={handleChange} value={formData.EwayBill} className="w-full border rounded-lg p-2" />
                                {errors.EwayBill && <p className="text-red-500 text-xs mt-1">{errors.EwayBill}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Book Shipment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Preview Section */}
                <div className="w-full bg-white rounded-lg shadow-md p-6">
                    <h2 className="flex justify-center font-semibold text-lg mb-4">Preview</h2>
                    <div className="grid grid-cols-2 gap-4 bg-gray-100 p-6 rounded-lg">
                        {Object.entries(formData).map(([key, value]) => (
                            <p key={key} className="text-sm">{key.replace(/([A-Z])/g, ' $1')}: <strong>{key === 'DateTime' ? formatValue(value) : value}</strong></p>

                        ))}
                    </div>
                </div>
            </div>
            {/* Slide-in Modal */}

            {showModal && modalType && (
                <AddModal
                    show={showModal}
                    type={modalType}
                    data={newModalData[modalType] || {}}
                    onClose={closeModal}
                    onChange={handleModalInputChange}
                    onAdd={handleAddNew}
                />
            )}           
        </div>
    );
}
export default ShipmentForm;