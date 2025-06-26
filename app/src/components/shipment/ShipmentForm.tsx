'use client';
import React, { useEffect } from 'react';
import ConsigneeModal from "@/components/modals/ConsigneeModal";
import VehicleModal from "@/components/modals/VehicleModal";
import ComponentCard from '../common/ComponentCard';
import Label from '../form/Label';
import Select from '../form/Select';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import Form from '../form/Form';
import { ChevronDownIcon } from '@/icons/index';
import useShipmentForm from '@/hooks/useShipmentForm';
import { SlideModal } from '../ui/slide-modal';
import EditDriver from '@/components/driver/EditDriver';
import EditConsigner from '@/components/consigner/EditConsigner';
import DefaultModal from '../example/ModalExample/DefaultModal';
import { useModal } from '@/hooks/useModal';

const ShipmentForm: React.FC = () => {
    
    const handleAddNewTrigger = (name:string) => {
        switch (name) {
            case 'Consigner': return consignerModal.openModal();
            //case 'Consignee': return consigneeModal.openModal();
            //case 'Driver': return driverModal.openModal();
            //case 'Vehicle': return vehicleModal.openModal();
        }
    };
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
    } = useShipmentForm(handleAddNewTrigger);

    const consignerModal = useModal();

  
    useEffect(() => {
        console.log("ShipmentForm loaded");
    }, []);
    
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
                                        onChange={(value) => handleChange("Consigner", { value })}
                                        defaultValue={formData.Consigner}
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
                                            onChange={(value) => handleChange("Consignee", { value })}
                                            defaultValue={formData.Consignee}
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
                                        onChange={handleChange}
                                        value={formData.DeliveryLocation}
                                        type="text"
                                    />
                                    {errors.DeliveryLocation && <p className="text-red-500 text-xs mt-1">{errors.DeliveryLocation}</p>}
                                </div>
                                <div>
                                    <Label>Date/Time</Label>
                                    <Input
                                        name="DateTime"
                                        onChange={handleChange}
                                        value={formData.DateTime}
                                        type="datetime-local"
                                    />
                                    {errors.DateTime && <p className="text-red-500 text-xs mt-1">{errors.DateTime}</p>}
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
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        name="Quantity"
                                        onChange={handleChange}
                                        value={formData.Quantity}
                                    />
                                    {errors.Quantity && <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>}
                                </div>
                                <div>
                                    <Label>Bill No</Label>
                                    <Input
                                        name="BillNo"
                                        onChange={handleChange}
                                        value={formData.BillNo}
                                    />
                                    {errors.BillNo && <p className="text-red-500 text-xs mt-1">{errors.BillNo}</p>}
                                </div>
                                <div>
                                    <Label>Value</Label>
                                    <Input
                                        type="number"
                                        name="Value"
                                        onChange={handleChange}
                                        value={formData.Value}
                                    />
                                    {errors.Value && <p className="text-red-500 text-xs mt-1">{errors.Value}</p>}
                                </div>
                                <div>
                                    <Label>Mode</Label>
                                    <div className="relative">
                                        <Select
                                            options={renderOptions(options.Mode, 'Mode')}
                                            placeholder="Select Mode"
                                            onChange={(value) => handleChange("Mode", { value })}
                                            defaultValue={formData.Mode}
                                        />
                                        <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                    {errors.Mode && <p className="text-red-500 text-xs mt-1">{errors.Mode}</p>}
                                </div>
                                <div>
                                    <Label>Actual Dimensions</Label>
                                    <Input
                                        name="ActualDimensions"
                                        onChange={handleChange}
                                        value={formData.ActualDimensions}
                                    />
                                    {errors.ActualDimensions && <p className="text-red-500 text-xs mt-1">{errors.ActualDimensions}</p>}
                                </div>
                                <div>
                                    <Label>Charged Dimensions</Label>
                                    <Input
                                        name="ChargedDimensions"
                                        onChange={handleChange}
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
                                            onChange={(value) => handleChange("UnitWeight", { value })}
                                            defaultValue={formData.UnitWeight}
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
                                        onChange={handleChange}
                                        value={formData.ActualWeight}
                                    />
                                    {errors.ActualWeight && <p className="text-red-500 text-xs mt-1">{errors.ActualWeight}</p>}
                                </div>
                                <div>
                                    <Label>Charged Weight</Label>
                                    <Input
                                        name="ChargedWeight"
                                        onChange={handleChange}
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
                                            onChange={(value) => handleChange("Driver", { value })}
                                            defaultValue={formData.Driver}
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
                                            onChange={(value) => handleChange("Vehicle", { value })}
                                            defaultValue={formData.Vehicle}
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
                                            onChange={(value) => handleChange("ServiceType", { value })}
                                            defaultValue={formData.ServiceType}
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
                                            onChange={(value) => handleChange("Provider", { value })}
                                            defaultValue={formData.Provider}
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
                                        onChange={handleChange}
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

                                if (key === 'DateTime' && value) {
                                    displayValue = formatValue(value);
                                }

                                return (
                                    <p key={key} className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong className="text-gray-800 dark:text-white">{formattedKey}:</strong> {displayValue || <span className="text-gray-400 dark:text-gray-500">-</span>}
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
                    <EditConsigner onSave={handleAddNew} onCancel={consignerModal.closeModal} />
                </SlideModal>
                {/* <ConsigneeModal show={showConsigneeModal} onClose={() => closeModal('Consignee')} onAdd={handleAddNew} />
                <VehicleModal show={showVehicleModal} onClose={() => closeModal('Vehicle')} onAdd={handleAddNew} />
                <Modal isOpen={showDriverModal} onClose={() => closeModal('Driver')}>
                    <EditDriver
                        onCancel={() => closeModal('Driver')}
                        onSave={handleAddNew}
                    />
                </Modal> */}
                {/* Individual Modals */}
                {/* <ConsignerModal
                    show={showConsignerModal}
                    onClose={() => closeModal('Consigner')}
                    onAdd={handleAddNew}
                />

                <ConsigneeModal
                    show={showConsigneeModal}
                    onClose={() => closeModal('Consignee')}
                    onAdd={handleAddNew}
                />

                <DriverModal
                    show={showDriverModal}
                    onClose={() => closeModal('Driver')}
                    onAdd={handleAddNew}
                />

                <VehicleModal
                    show={showVehicleModal}
                    onClose={() => closeModal('Vehicle')}
                    onAdd={handleAddNew}
                /> */}
            </div>
        </ComponentCard>
    );
};

export default ShipmentForm;
