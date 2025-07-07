import React, { useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';
import { getConsigners } from '@/utils/api/consignerApi';
import { getConsignees } from '@/utils/api/consigneeApi';
import { getDrivers } from '@/utils/api/driverApi';
import { getVehicles } from '@/utils/api/vehicleApi';
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Form from '@/components/form/Form';
import { ChevronDownIcon } from '@/icons/index';

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

    const [formData, setFormData] = useState({
        Consigner: getIdValue(shipment.consigner),
        Consignee: getIdValue(shipment.consignee),
        DeliveryLocation: shipment.delivery_location || '',
        ExpectedDeliveryDateTime: shipment.date_time ? new Date(shipment.date_time).toISOString().slice(0, 16) : '',
        Description: shipment.goods_details?.description || '',
        Quantity: shipment.goods_details?.quantity || '',
        BillNo: shipment.goods_details?.bill_no || '',
        BillDate: shipment.goods_details?.bill_date ? new Date(shipment.goods_details.bill_date).toISOString().slice(0, 16) : '',
        BillValue: shipment.goods_details?.bill_value || '',
        Mode: shipment.goods_details?.mode || '',
        ActualDimensions: shipment.goods_details?.actual_dimensions || '',
        ChargedDimensions: shipment.goods_details?.charged_dimensions || '',
        UnitWeight: shipment.goods_details?.unit_of_weight || '',
        ActualWeight: shipment.goods_details?.actual_weight || '',
        ChargedWeight: shipment.goods_details?.charged_weight || '',
        Instructions: shipment.goods_details?.special_instructions || '',
        Driver: getIdValue(shipment.driver),
        Vehicle: getIdValue(shipment.vehicle),
        ServiceType: shipment.service_type || '',
        Provider: shipment.provider || '',
        EwayBill: shipment.eway_bill_number || '',
        Status: shipment.status || '',
    });

    const [options, setOptions] = useState({
        Consigner: [],
        Consignee: [],
        Driver: [],
        Vehicle: [],
        Mode: [
            { value: 'Transport', label: 'Transport' },
            { value: 'Door Delivery', label: 'Door Delivery' },
        ],
        UnitWeight: [
            { value: 'Per Kg', label: 'Per Kg' },
            { value: 'LPT (Less than Truckload)', label: 'LPT (Less than Truckload)' },
            { value: 'FTL (Turbo)', label: 'FTL (Turbo)' },
            { value: 'Turbo', label: 'Turbo' },
        ],
        ServiceType: [
            { value: 'Standard', label: 'Standard' },
            { value: 'Express', label: 'Express' },
        ],
        Provider: [
            { value: 'Owner', label: 'Owner' },
            { value: 'Agency', label: 'Agency' },
        ],
    });

    useEffect(() => {
        Promise.all([
            getConsigners(),
            getConsignees(),
            getDrivers(),
            getVehicles()
        ]).then(([consigners, consignees, drivers, vehicles]) => {
            setOptions(prev => ({
                ...prev,
                Consigner: consigners.map((c: any) => ({ value: c._id, label: c.contact?.name || c.name })),
                Consignee: consignees.map((c: any) => ({ value: c._id, label: c.contact?.name || c.name })),
                Driver: drivers.map((d: any) => ({ value: d._id, label: d.contact?.name || d.name })),
                Vehicle: vehicles.map((v: any) => ({ value: v._id, label: v.vehicle_number || v.name })),
            }));
        });
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = {
            _id: shipment._id,
            consigner: formData.Consigner,
            consignee: formData.Consignee,
            delivery_location: formData.DeliveryLocation,
            date_time: formData.ExpectedDeliveryDateTime,
            driver: formData.Driver,
            vehicle: formData.Vehicle,
            service_type: formData.ServiceType,
            provider: formData.Provider,
            eway_bill_number: formData.EwayBill,
            status: formData.Status,
            goods_details: {
                description: formData.Description,
                quantity: formData.Quantity,
                bill_no: formData.BillNo,
                bill_date: formData.BillDate,
                bill_value: formData.BillValue,
                mode: formData.Mode,
                actual_dimensions: formData.ActualDimensions,
                charged_dimensions: formData.ChargedDimensions,
                unit_of_weight: formData.UnitWeight,
                actual_weight: formData.ActualWeight,
                charged_weight: formData.ChargedWeight,
                special_instructions: formData.Instructions,
            },
        };
        onSave(updated);
    };

    const renderOptions = (optionsArr: any[], type: string) => {
        return optionsArr.map((option: any) => ({
            value: option.value,
            label: option.label
        }));
    };

    const getLabelById = (optionsArr: any[], id: string) => {
        if (!id) return '';
        const found = optionsArr.find((opt) => opt.value === id);
        return found ? found.label : id;
    };

    return (
        <ComponentCard title="Edit Shipment">
            <div>
                    <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-6">
                        <Form className="flex-[3] space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <Label>Consigner</Label>
                                <div className="relative">
                                    <Select
                                        options={renderOptions(options.Consigner, 'Consigner')}
                                        placeholder="Select Consigner"
                                        onChange={(value) => handleSelectChange("Consigner", value)}
                                        value={formData.Consigner}
                                    />
                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Consignee</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Consignee, 'Consignee')}
                                            placeholder="Select Consignee"
                                            onChange={(value) => handleSelectChange("Consignee", value)}
                                            value={formData.Consignee}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Delivery Location</Label>
                                    <Input
                                        name="DeliveryLocation"
                                        onChange={handleChange}
                                        value={formData.DeliveryLocation}
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <Label>Expected Date/Time</Label>
                                    <Input
                                        name="ExpectedDeliveryDateTime"
                                        onChange={handleChange}
                                        value={formData.ExpectedDeliveryDateTime}
                                        type="datetime-local"
                                    />
                                </div>
                            </div>

                            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Goods Details</h2>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="row-span-3">
                                    <Label>Description</Label>
                                    <TextArea
                                        value={formData.Description}
                                        onChange={(value) => handleChange({ target: { name: 'Description', value } })}
                                        rows={10}
                                    />
                                </div>

                                <div>
                                    <Label>Bill No</Label>
                                    <Input
                                        name="BillNo"
                                        onChange={handleChange}
                                        value={formData.BillNo}
                                    />
                                </div>
                                <div>
                                    <Label>Bill Date</Label>
                                    <Input
                                        name="BillDate"
                                        onChange={handleChange}
                                        value={formData.BillDate}
                                        type="datetime-local"
                                    />
                                </div>

                                <div>
                                    <Label>Bill Value</Label>
                                    <Input
                                        name="BillValue"
                                        onChange={handleChange}
                                        value={formData.BillValue}
                                    />
                                </div>
                                <div>
                                    <Label>Mode</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Mode, 'Mode')}
                                            placeholder="Select Mode"
                                            onChange={(value) => handleSelectChange("Mode", value)}
                                            value={formData.Mode}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        name="Quantity"
                                        onChange={handleChange}
                                        value={formData.Quantity}
                                    />
                                </div>
                            <div>
                                <Label>Provider</Label>
                                <div className="relative">
                                    <Select
                                        options={renderOptions(options.Provider, 'Provider')}
                                        placeholder="Select Provider Type"
                                        onChange={(value) => handleSelectChange("Provider", value)}
                                        value={formData.Provider}
                                    />
                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>
                                <div>
                                    <Label>Actual Dimensions</Label>
                                    <Input
                                        name="ActualDimensions"
                                        onChange={handleChange}
                                        value={formData.ActualDimensions}
                                    />
                                </div>
                                <div>
                                    <Label>Charged Dimensions</Label>
                                    <Input
                                        name="ChargedDimensions"
                                        onChange={handleChange}
                                        value={formData.ChargedDimensions}
                                    />
                                </div>
                                <div>
                                    <Label>Unit of Weight</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.UnitWeight, 'UnitWeight')}
                                            placeholder="Select Unit"
                                            onChange={(value) => handleSelectChange("UnitWeight", value)}
                                            value={formData.UnitWeight}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Actual Weight</Label>
                                    <Input
                                        name="ActualWeight"
                                        onChange={handleChange}
                                        value={formData.ActualWeight}
                                    />
                                </div>
                                <div>
                                    <Label>Charged Weight</Label>
                                    <Input
                                        name="ChargedWeight"
                                        onChange={handleChange}
                                        value={formData.ChargedWeight}
                                    />
                                </div>
                                <div className="row-span-3">
                                    <Label>Special Instructions</Label>
                                    <TextArea
                                        value={formData.Instructions}
                                        onChange={(value) => handleChange({ target: { name: 'Instructions', value } })}
                                        rows={10}
                                    />
                                </div>
                                <div>
                                    <Label>Driver</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Driver, 'Driver')}
                                            placeholder="Select Driver"
                                            onChange={(value) => handleSelectChange("Driver", value)}
                                            value={formData.Driver}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Vehicle</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Vehicle, 'Vehicle')}
                                            placeholder="Select Vehicle"
                                            onChange={(value) => handleSelectChange("Vehicle", value)}
                                            value={formData.Vehicle}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Service Type</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.ServiceType, 'ServiceType')}
                                            placeholder="Select Service Type"
                                            onChange={(value) => handleSelectChange("ServiceType", value)}
                                            value={formData.ServiceType}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label>Eway Bill Number</Label>
                                    <Input
                                        name="EwayBill"
                                        onChange={handleChange}
                                        value={formData.EwayBill}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
        </ComponentCard>
    );
};

export default EditShipment; 