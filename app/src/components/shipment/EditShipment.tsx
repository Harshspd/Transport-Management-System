'use client';
import React, { useEffect } from 'react';
// import ConsigneeModal from "@/components/modals/ConsigneeModal";
// import VehicleModal from "@/components/modals/VehicleModal";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Form from '@/components/form/Form';
import { ChevronDownIcon } from '@/icons/index';
import useShipmentForm from '@/hooks/useShipmentForm';
import { SlideModal } from '@/components/ui/slide-modal';
import EditDriver from '@/components/driver/EditDriver';
import EditConsigner from '@/components/consigner/EditConsigner';
import EditConsignee from '@/components/consignee/EditConsignee';
import EditVehicle from '@/components/vehicle/EditVehicle';
import { Consigner } from '@/types/consigner';
import { Consignee } from '@/types/consignee';
import { Driver } from '@/types/driver';
import { Vehicle } from '@/types/vehicle';
import { OptionType } from '@/types/type';
import { Shipment } from '@/types/shipment';

interface EditShipmentProps {
    onSave: (updated: Shipment) => void;
    onCancel: () => void;
    shipmentId?: string;
}
const EditShipment: React.FC<EditShipmentProps> = ({ onSave, onCancel, shipmentId }) => {


    const {
        formData,
        errors,
        options,
        isFormValid,
        handleChange,
        handleSubmit,
        handleAddNew,
        renderOptions,
        formatValue,
        consignerModal,
        consigneeModal,
        driverModal,
        vehicleModal,
        getSelectedOptionLabel
    } = useShipmentForm(onSave,onCancel,shipmentId);
    useEffect(() => {
        console.log("ShipmentForm loaded");
    }, []);


    const handleAddNewAndClose = async (type:string, newEntry: any) => {
       await handleAddNew(type, newEntry);
    };

    return (
        <ComponentCard title="Shipment Booking">
            <div>
                <h1 className="text-xl font-semibold pb-2 text-gray-800 dark:text-white">Shipment Booking</h1>
                <div className="grid grid-cols-[66%_34%] w-full gap-4">
                    <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-6">
                        {/* Left Form Section */}
                        <Form className="flex-[3] space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <Label>Consigner</Label>
                                <div className="relative">
                                    <Select
                                        options={renderOptions(options.Consigner, 'Consigner')}
                                        placeholder="Select an option"
                                        onChange={(value) => handleChange("Consigner", value)}
                                        value={formData.Consigner}
                                    />
                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                                {errors.Consigner && <p className="text-red-500 text-xs mt-1">{errors.Consigner}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Consignee</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Consignee, 'Consignee')}
                                            placeholder="Select an option"
                                            onChange={(value) => handleChange("Consignee", value)}
                                            value={formData.Consignee}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.Consignee && <p className="text-red-500 text-xs mt-1">{errors.Consignee}</p>}
                                </div>
                                <div>
                                    <Label>Delivery Location</Label>
                                    <Input
                                        name="DeliveryLocation"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.DeliveryLocation}
                                        type="text"
                                    />
                                    {errors.DeliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.DeliveryLocation}</p>}
                                </div>
                                <div>
                                    <Label>Expected Date/Time</Label>
                                    <Input
                                        name="ExpectedDeliveryDateTime"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.ExpectedDeliveryDateTime}
                                        type="datetime-local"
                                    />
                                    {errors.ExpectedDeliveryDateTime && <p className="text-red-500 text-xs mt-1">{errors.ExpectedDeliveryDateTime}</p>}
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
                                    {errors.Description && <p className="text-red-500 text-xs mt-1">{errors.Description}</p>}
                                </div>
                                
                                <div>
                                    <Label>Bill No</Label>
                                    <Input
                                        name="BillNo"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.BillNo}
                                    />
                                    {errors.BillNo && <p className="text-red-500 text-xs mt-1">{errors.BillNo}</p>}
                                </div>
                                <div>
                                    <Label>BillDate</Label>
                                    <Input
                                        name="billDate"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.BillDate}
                                        type="datetime-local"
                                    />
                                    {errors.BillDate && <p className="text-red-500 text-xs mt-1">{errors.BillDate}</p>}
                                </div>
                                

                                <div>
                                    <Label>Bill Value</Label>
                                    <Input
                                        name="BillValue"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.BillValue}
                                    />
                                    {errors.BillValue && <p className="text-red-500 text-xs mt-1">{errors.BillValue}</p>}
                                </div>
                                <div>
                                    <Label>Mode</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Mode, 'Mode')}
                                            placeholder="Select Mode"
                                            onChange={(value) => handleChange("Mode", value)}
                                            value={formData.Mode}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.Mode && <p className="text-red-500 text-xs mt-1">{errors.Mode}</p>}
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        name="Quantity"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.Quantity}
                                    />
                                    {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
                                </div>
                                <div>
                                    <Label>Actual Dimensions</Label>
                                    <Input
                                        name="ActualDimensions"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.ActualDimensions}
                                    />
                                    {errors.ActualDimensions && <p className="text-red-500 text-xs mt-1">{errors.ActualDimensions}</p>}
                                </div>
                                <div>
                                    <Label>Charged Dimensions</Label>
                                    <Input
                                        name="ChargedDimensions"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.ChargedDimensions}
                                    />
                                    {errors.ChargedDimensions && <p className="text-red-500 text-xs mt-1">{errors.ChargedDimensions}</p>}
                                </div>
                                <div>
                                    <Label>Unit of Weight</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.UnitWeight, 'UnitWeight')}
                                            placeholder="Select Unit"
                                            onChange={(value) => handleChange("UnitWeight", value)}
                                            value={formData.UnitWeight}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.UnitWeight && <p className="text-red-500 text-xs mt-1">{errors.UnitWeight}</p>}
                                </div>
                                <div>
                                    <Label>Actual Weight</Label>
                                    <Input
                                        name="ActualWeight"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.ActualWeight}
                                    />
                                    {errors.ActualWeight && <p className="text-red-500 text-xs mt-1">{errors.ActualWeight}</p>}
                                </div>
                                <div>
                                    <Label>Charged Weight</Label>
                                    <Input
                                        name="ChargedWeight"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.ChargedWeight}
                                    />
                                    {errors.ChargedWeight && <p className="text-red-500 text-xs mt-1">{errors.ChargedWeight}</p>}
                                </div>
                                <div className="row-span-3">
                                    <Label>Special Instructions</Label>
                                    <TextArea
                                        value={formData.Instructions}
                                        onChange={(value) => handleChange({ target: { name: 'Instructions', value } })}
                                        rows={10}
                                    />
                                    {errors.Instructions && <p className="text-red-500 text-xs mt-1">{errors.Instructions}</p>}
                                </div>
                                <div>
                                    <Label>Driver</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Driver, 'Driver')}
                                            placeholder="Select Driver"
                                            onChange={(value) => handleChange("Driver", value)}
                                            value={formData.Driver}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.Driver && <p className="text-red-500 text-xs mt-1">{errors.Driver}</p>}
                                </div>
                                <div>
                                    <Label>Vehicle</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Vehicle, 'Vehicle')}
                                            placeholder="Select Vehicle"
                                            onChange={(value) => handleChange("Vehicle", value)}
                                            value={formData.Vehicle}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.Vehicle && <p className="text-red-500 text-xs mt-1">{errors.Vehicle}</p>}
                                </div>
                                <div>
                                    <Label>Service Type</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.ServiceType, 'ServiceType')}
                                            placeholder="Select Service Type"
                                            onChange={(value) => handleChange("ServiceType", value)}
                                            value={formData.ServiceType}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.ServiceType && <p className="text-red-500 text-xs mt-1">{errors.ServiceType}</p>}
                                </div>
                                <div>
                                    <Label>Provider</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Provider, 'Provider')}
                                            placeholder="Select Provider Type"
                                            onChange={(value) => handleChange("Provider", value)}
                                            value={formData.Provider}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.Provider && <p className="text-red-500 text-xs mt-1">{errors.Provider}</p>}
                                </div>
                                <div>
                                    <Label>Eway Bill Number</Label>
                                    <Input
                                        name="EwayBill"
                                        onChange={(e) => handleChange(e)}
                                        value={formData.EwayBill}
                                    />
                                    {errors.EwayBill && <p className="text-red-500 text-xs mt-1">{errors.EwayBill}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className={`bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Book Shipment
                                </button>
                            </div>
                        </Form>
                    </div>

                    {/* Right Preview Section */}
                    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="flex justify-center font-semibold text-lg mb-4 text-gray-800 dark:text-white">Preview</h2>
                        <div className="grid grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                            {Object.entries(formData).map(([key, value]) => {
                                const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();

                                let displayValue = value;
                                if (["Consigner", "Consignee", "Driver", "Vehicle"].includes(key)) {
                                    displayValue = getSelectedOptionLabel(String(value),key);
                                }
                                if (key === 'DateTime' && value) {
                                    displayValue = formatValue(value);
                                }

                                return (
                                    <p key={key} className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong className="text-gray-800 dark:text-white">{formattedKey}:</strong> {(typeof displayValue === 'string' || typeof displayValue === 'number') ? displayValue : <span className="text-gray-400 dark:text-gray-500">-</span>}
                                    </p>
                                );
                            })}
                        </div>
                        {!Object.values(formData).some(value => value) && (
                            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Fill in the form to see preview</p>
                        )}
                    </div>


                </div>
                {/* Modals */}

                <SlideModal title='Add Consigner' isOpen={consignerModal.isOpen} onClose={consignerModal.closeModal}>
                    <EditConsigner onSave={(data:Consigner)=>handleAddNewAndClose('Consigner',data)} onCancel={()=> consignerModal.closeModal} />
                </SlideModal>
                <SlideModal title='Add Consignee' isOpen={consigneeModal.isOpen} onClose={consigneeModal.closeModal}>
                    <EditConsignee onSave={(data:Consignee)=>handleAddNewAndClose('Consignee',data)} onCancel={()=>consignerModal.closeModal} />
                </SlideModal>
                <SlideModal title='Add Driver' isOpen={driverModal.isOpen} onClose={driverModal.closeModal}>
                    <EditDriver onSave={(data:Driver)=>handleAddNewAndClose('Driver',data)} onCancel={()=>driverModal.closeModal} />
                </SlideModal>
                <SlideModal title='Add Vehicle' isOpen={vehicleModal.isOpen} onClose={vehicleModal.closeModal}>
                    <EditVehicle onSave={(data:Vehicle)=>handleAddNewAndClose('Vehicle',data)}/>
                </SlideModal>
            </div>
        </ComponentCard>
    );
};

export default EditShipment;
