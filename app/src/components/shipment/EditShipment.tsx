import React, { useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';
import { getConsigners } from '@/utils/api/consignerApi';
import { getConsignees } from '@/utils/api/consigneeApi';
import { getDrivers } from '@/utils/api/driverApi';
import { getVehicles } from '@/utils/api/vehicleApi';

interface EditShipmentProps {
    shipment: any;
    onSave: (updated: any) => void;
    onCancel: () => void;
}

const EditShipment: React.FC<EditShipmentProps> = ({ shipment, onSave, onCancel }) => {
    const getDisplayValue = (entity: any) => {
        if (!entity) return '';
        if (typeof entity === 'string') return entity;
        return entity.name || entity.contact?.name || entity.vehicle_number || '';
    };

    const getIdValue = (entity: any) => {
        if (!entity) return '';
        if (typeof entity === 'string') return entity;
        return entity._id || '';
    };

    const [form, setForm] = useState({
        consignerName: getDisplayValue(shipment.consigner),
        consignerId: getIdValue(shipment.consigner),
        consigneeName: getDisplayValue(shipment.consignee),
        consigneeId: getIdValue(shipment.consignee),
        delivery_location: shipment.delivery_location || '',
        date_time: shipment.date_time ? new Date(shipment.date_time).toISOString().slice(0, 16) : '',
        description: shipment.goods_details?.description || '',
        quantity: shipment.goods_details?.quantity || '',
        bill_no: shipment.goods_details?.bill_no || '',
        bill_date: shipment.goods_details?.bill_date ? new Date(shipment.goods_details.bill_date).toISOString().slice(0, 10) : '',
        bill_value: shipment.goods_details?.bill_value || '',
        mode: shipment.goods_details?.mode || '',
        actual_dimensions: shipment.goods_details?.actual_dimensions || '',
        charged_dimensions: shipment.goods_details?.charged_dimensions || '',
        unit_of_weight: shipment.goods_details?.unit_of_weight || '',
        actual_weight: shipment.goods_details?.actual_weight || '',
        charged_weight: shipment.goods_details?.charged_weight || '',
        special_instructions: shipment.goods_details?.special_instructions || '',
        driverName: getDisplayValue(shipment.driver),
        driverId: getIdValue(shipment.driver),
        vehicleName: getDisplayValue(shipment.vehicle),
        vehicleId: getIdValue(shipment.vehicle),
        service_type: shipment.service_type || '',
        provider: shipment.provider || '',
        eway_bill_number: shipment.eway_bill_number || '',
        status: shipment.status || '',
    });

    const [consignerOptions, setConsignerOptions] = useState<any[]>([]);
    const [consigneeOptions, setConsigneeOptions] = useState<any[]>([]);
    const [driverOptions, setDriverOptions] = useState<any[]>([]);
    const [vehicleOptions, setVehicleOptions] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            getConsigners(),
            getConsignees(),
            getDrivers(),
            getVehicles()
        ]).then(([consigners, consignees, drivers, vehicles]) => {
            setConsignerOptions(consigners.map((c: any) => ({ value: c._id, label: c.contact?.name || c.name })));
            setConsigneeOptions(consignees.map((c: any) => ({ value: c._id, label: c.contact?.name || c.name })));
            setDriverOptions(drivers.map((d: any) => ({ value: d._id, label: d.contact?.name || d.name })));
            setVehicleOptions(vehicles.map((v: any) => ({ value: v._id, label: v.vehicle_number || v.name })));
        });
    }, []);

    const getIdByName = (options: any[], name: string) => {
        const found = options.find(opt => opt.label === name);
        return found ? found.value : undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Map names to IDs for reference fields if possible
        const consignerId = getIdByName(consignerOptions, form.consignerName);
        const consigneeId = getIdByName(consigneeOptions, form.consigneeName);
        const driverId = getIdByName(driverOptions, form.driverName);
        const vehicleId = getIdByName(vehicleOptions, form.vehicleName);
        const updated = {
            _id: shipment._id,
            ...form,
            consigner: consignerId,
            consignee: consigneeId,
            driver: driverId,
            vehicle: vehicleId,
            goods_details: {
                description: form.description,
                quantity: form.quantity,
                bill_no: form.bill_no,
                bill_date: form.bill_date,
                bill_value: form.bill_value,
                mode: form.mode,
                actual_dimensions: form.actual_dimensions,
                charged_dimensions: form.charged_dimensions,
                unit_of_weight: form.unit_of_weight,
                actual_weight: form.actual_weight,
                charged_weight: form.charged_weight,
                special_instructions: form.special_instructions,
            },
        };
        onSave(updated);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Consigner</label>
                <input
                    type="text"
                    name="consignerName"
                    value={form.consignerName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Consignee</label>
                <input
                    type="text"
                    name="consigneeName"
                    value={form.consigneeName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Delivery Location</label>
                <input
                    type="text"
                    name="delivery_location"
                    value={form.delivery_location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expected Delivery Date/Time</label>
                <input
                    type="datetime-local"
                    name="date_time"
                    value={form.date_time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                <input type="text" name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Quantity</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bill No</label>
                <input type="text" name="bill_no" value={form.bill_no} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bill Date</label>
                <input type="date" name="bill_date" value={form.bill_date} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bill Value</label>
                <input type="number" name="bill_value" value={form.bill_value} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Mode</label>
                <input type="text" name="mode" value={form.mode} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Actual Dimensions</label>
                <input type="number" name="actual_dimensions" value={form.actual_dimensions} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Charged Dimensions</label>
                <input type="number" name="charged_dimensions" value={form.charged_dimensions} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unit Weight</label>
                <input type="text" name="unit_of_weight" value={form.unit_of_weight} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Actual Weight</label>
                <input type="number" name="actual_weight" value={form.actual_weight} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Charged Weight</label>
                <input type="number" name="charged_weight" value={form.charged_weight} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Instructions</label>
                <input type="text" name="special_instructions" value={form.special_instructions} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Driver</label>
                <input
                    type="text"
                    name="driverName"
                    value={form.driverName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Vehicle</label>
                <input
                    type="text"
                    name="vehicleName"
                    value={form.vehicleName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Service Type</label>
                <input
                    type="text"
                    name="service_type"
                    value={form.service_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Provider</label>
                <input
                    type="text"
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Eway Bill Number</label>
                <input
                    type="text"
                    name="eway_bill_number"
                    value={form.eway_bill_number}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                >
                    <option value="open">Open</option>
                    <option value="in-transit">In-Transit</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>
            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
};

export default EditShipment; 