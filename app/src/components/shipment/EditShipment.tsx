import React, { useState } from 'react';
import { Shipment } from '@/types/shipment';

interface EditShipmentProps {
    shipment: any;
    onSave: (updated: any) => void;
    onCancel: () => void;
}

const EditShipment: React.FC<EditShipmentProps> = ({ shipment, onSave, onCancel }) => {
    const [form, setForm] = useState({
        delivery_location: shipment.delivery_location || '',
        date_time: shipment.date_time ? new Date(shipment.date_time).toISOString().slice(0, 16) : '',
        status: shipment.status || '',
        // Add more fields as needed
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...shipment, ...form });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
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
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date/Time</label>
                <input
                    type="datetime-local"
                    name="date_time"
                    value={form.date_time}
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
                    <option value="pending">Pending</option>
                    <option value="in-transit">In-Transit</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>
            {/* Add more fields as needed */}
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