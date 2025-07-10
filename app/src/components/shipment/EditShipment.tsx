'use client';
import React, { useEffect, useState } from 'react';
// import ConsigneeModal from "@/components/modals/ConsigneeModal";
// import VehicleModal from "@/components/modals/VehicleModal";
import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useShipmentForm from '@/hooks/useShipmentForm';
import { ChevronDownIcon } from '@/icons/index';
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
import { createShipment, getShipmentById, updateShipment } from '@/utils/api/shipmentApi';
import { toast } from 'react-toastify';
import { Agent } from '@/types/agent';
import EditAgent from '../agent/EditAgent';

interface EditShipmentProps {
    onSave: (updated: Shipment) => void;
    onCancel: () => void;
    shipmentId?: string;
}

const defaultInitialValues = {
    Consigner: '',
    Consignee: '',
    DeliveryLocation: '',
    ExpectedDeliveryDateTime: '',
    Description: '',
    Quantity: '',
    BillNo: '',
    BillDate: '',
    BillValue: '',
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
    Agency: '',
};

const shipmentSchema = Yup.object().shape({
    Consigner: Yup.string().required('Consigner is required'),
    Consignee: Yup.string().required('Consignee is required'),
    DeliveryLocation: Yup.string().required('Delivery Location is required'),
    ExpectedDeliveryDateTime: Yup.string(),
    Description: Yup.string(),
    Quantity: Yup.string().required('Quantity is required'),
    BillNo: Yup.string().required('Bill No is required'),
    BillDate: Yup.string(),
    BillValue: Yup.string().required('Bill Value is required'),
    Mode: Yup.string(),
    ActualDimensions: Yup.string(),
    ChargedDimensions: Yup.string(),
    UnitWeight: Yup.string(),
    ActualWeight: Yup.string(),
    ChargedWeight: Yup.string(),
    Instructions: Yup.string(),
    Driver: Yup.string(),
    Vehicle: Yup.string(),
    ServiceType: Yup.string(),
    Provider: Yup.string(),
    EwayBill: Yup.string(),
});

function transformShipmentToFormValues(shipment: any) {
    return {
        Consigner: shipment.consigner?._id || shipment.consigner || '',
        Consignee: shipment.consignee?._id || shipment.consignee || '',
        DeliveryLocation: shipment.delivery_location || '',
        ExpectedDeliveryDateTime: shipment.expected_delivery_date_and_time ? new Date(shipment.expected_delivery_date_and_time).toISOString().slice(0, 16) : '',
        Description: shipment.goods_details?.description || '',
        Quantity: shipment.goods_details?.quantity?.toString() || '',
        BillNo: shipment.goods_details?.bill_no || '',
        BillDate: shipment.goods_details?.bill_date ? new Date(shipment.goods_details.bill_date).toISOString().slice(0, 16) : '',
        BillValue: shipment.goods_details?.bill_value?.toString() || '',
        Mode: shipment.goods_details?.mode || '',
        ActualDimensions: shipment.goods_details?.actual_dimensions?.toString() || '',
        ChargedDimensions: shipment.goods_details?.charged_dimensions?.toString() || '',
        UnitWeight: shipment.goods_details?.unit_of_weight || '',
        ActualWeight: shipment.goods_details?.actual_weight?.toString() || '',
        ChargedWeight: shipment.goods_details?.charged_weight?.toString() || '',
        Instructions: shipment.goods_details?.special_instructions || '',
        Driver: shipment.driver?._id || shipment.driver || '',
        Vehicle: shipment.vehicle?._id || shipment.vehicle || '',
        ServiceType: shipment.service_type || '',
        Provider: shipment.provider || '',
        EwayBill: shipment.eway_bill_number || '',
        Agency: shipment.agent?._id || ''
    };
}

const EditShipment: React.FC<EditShipmentProps> = ({ onSave, onCancel, shipmentId }) => {
    const {
        options,
        handleAddNew,
        renderOptions,
        formatValue,
        consignerModal,
        consigneeModal,
        driverModal,
        vehicleModal,
        agentModal,
        getSelectedOptionLabel
    } = useShipmentForm(onSave, onCancel, shipmentId);

    const [initialValues, setInitialValues] = useState(defaultInitialValues);
    const [shipmentData, setShipmentData] = useState<any>(null);

    useEffect(() => {
        if (shipmentId) {
            getShipmentById(shipmentId)
                .then((data) => {
                    setShipmentData(data.data); 
                    setInitialValues(transformShipmentToFormValues(data.data));
                })
                .catch((err) => {
                    toast.error('Failed to fetch shipment for editing.');
                })
        } else {
            setInitialValues(defaultInitialValues);
            setShipmentData(null);
            
        }
    }, [shipmentId]);

   
    // Helper for modal save
    const handleAddNewAndClose = async (type: string, newEntry: any, setFieldValue?: any) => {
        await handleAddNew(type, newEntry);
        if(newEntry) setFieldValue(type, newEntry?._id)
    };

    return (
        <ComponentCard title={`Shipment Booking${shipmentData && shipmentData.bility_no ? ' - ' + shipmentData.bility_no : ''}`}>
            <div>
                <h1 className="text-xl font-semibold pb-2 text-gray-800 dark:text-white">Shipment Booking </h1>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={shipmentSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        // Transform values to Shipment type
                        const shipment: any = {
                            consigner: values.Consigner,
                            consignee: values.Consignee,
                            driver: values.Driver,
                            vehicle: values.Vehicle,
                            delivery_location: values.DeliveryLocation,
                            expected_delivery_date_and_time: values.ExpectedDeliveryDateTime ? new Date(values.ExpectedDeliveryDateTime) : undefined,
                            goods_details: {
                                description: values.Description,
                                quantity: Number(values.Quantity),
                                bill_no: values.BillNo,
                                bill_date: values.BillDate ? new Date(values.BillDate) : undefined,
                                bill_value: Number(values.BillValue),
                                mode: values.Mode,
                                actual_dimensions: Number(values.ActualDimensions),
                                charged_dimensions: Number(values.ChargedDimensions),
                                unit_of_weight: values.UnitWeight,
                                actual_weight: Number(values.ActualWeight),
                                charged_weight: Number(values.ChargedWeight),
                                special_instructions: values.Instructions,
                            },
                            service_type: values.ServiceType,
                            provider: values.Provider,
                            eway_bill_number: values.EwayBill,
                            status: 'Open',
                            agent: values.Agency
                        };
                        try {
                            let response;
                            if (shipmentId) {
                                response = await updateShipment(shipmentId, shipment);
                            } else {
                                response = await createShipment(shipment);
                            }
                            onSave(response);
                            resetForm();
                        } catch (error) {
                            toast.error('Error booking shipment. Please try again.' + (error instanceof Error ? `: ${error.message}` : ''));
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting, handleSubmit  }) => (
                        <div>
                            <div className="grid grid-cols-[66%_34%] w-full gap-4">
                                <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-6">
                                    {/* Left Form Section */}
                                    <div className="flex-[3] space-y-4">
                                        <div>
                                            <Label>Consigner</Label>
                                            <div className="relative">
                                                <Field
                                                    as={Select}
                                                    name="Consigner"
                                                    options={renderOptions(options.Consigner, 'Consigner')}
                                                    placeholder="Select an option"
                                                    value={values.Consigner}
                                                    onChange={(val: string) => {
                                                        if (val === '+Add new') {
                                                          consignerModal.openModal();
                                                        } else {
                                                          setFieldValue('Consigner', val);
                                                        }
                                                      }}
                                                />
                                                <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                    <ChevronDownIcon />
                                                </span>
                                            </div>
                                            <ErrorMessage name="Consigner" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label>Consignee</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="Consignee"
                                                        options={renderOptions(options.Consignee, 'Consignee')}
                                                        placeholder="Select an option"
                                                        value={values.Consignee}
                                                        onChange={(val: string) => {
                                                            if (val === '+Add new') {
                                                                consigneeModal.openModal();
                                                            } else {
                                                              setFieldValue('Consignee', val);
                                                                const selectedConsignee = options.Consignee.find(
                                                                    (c: any) => c.value === val
                                                                );
                                                                setFieldValue('DeliveryLocation', selectedConsignee?.city ?? '');
                                                            }
                                                          }}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="Consignee" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Delivery Location</Label>
                                                <Field
                                                    as={Input}
                                                    name="DeliveryLocation"
                                                    value={values.DeliveryLocation}
                                                    onChange={(e: any) => setFieldValue('DeliveryLocation', e.target.value)}
                                                    type="text"
                                                />
                                                <ErrorMessage name="DeliveryLocation" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Expected Date/Time</Label>
                                                <Field
                                                    as={Input}
                                                    name="ExpectedDeliveryDateTime"
                                                    value={values.ExpectedDeliveryDateTime}
                                                    onChange={(e: any) => setFieldValue('ExpectedDeliveryDateTime', e.target.value)}
                                                    type="datetime-local"
                                                />
                                                <ErrorMessage name="ExpectedDeliveryDateTime" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>

                                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Goods Details</h2>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="row-span-3">
                                                <Label>Description</Label>
                                                <Field
                                                    as={TextArea}
                                                    name="Description"
                                                    value={values.Description}
                                                    onChange={(val: string) => setFieldValue('Description', val)}
                                                    rows={10}
                                                />
                                                <ErrorMessage name="Description" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Bill No</Label>
                                                <Field
                                                    as={Input}
                                                    name="BillNo"
                                                    value={values.BillNo}
                                                    onChange={(e: any) => setFieldValue('BillNo', e.target.value)}
                                                />
                                                <ErrorMessage name="BillNo" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>BillDate</Label>
                                                <Field
                                                    as={Input}
                                                    name="BillDate"
                                                    value={values.BillDate}
                                                    onChange={(e: any) => setFieldValue('BillDate', e.target.value)}
                                                    type="datetime-local"
                                                />
                                                <ErrorMessage name="BillDate" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Bill Value</Label>
                                                <Field
                                                    as={Input}
                                                    name="BillValue"
                                                    value={values.BillValue}
                                                    onChange={(e: any) => setFieldValue('BillValue', e.target.value)}
                                                />
                                                <ErrorMessage name="BillValue" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Mode</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="Mode"
                                                        options={renderOptions(options.Mode, 'Mode')}
                                                        placeholder="Select Mode"
                                                        value={values.Mode}
                                                        onChange={(val: string) => setFieldValue('Mode', val)}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="Mode" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Quantity/Cases</Label>
                                                <Field
                                                    as={Input}
                                                    type="number"
                                                    name="Quantity"
                                                    value={values.Quantity}
                                                    onChange={(e: any) => setFieldValue('Quantity', e.target.value)}
                                                />
                                                <ErrorMessage name="Quantity" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Actual Dimensions</Label>
                                                <Field
                                                    as={Input}
                                                    name="ActualDimensions"
                                                    value={values.ActualDimensions}
                                                    onChange={(e: any) => setFieldValue('ActualDimensions', e.target.value)}
                                                />
                                                <ErrorMessage name="ActualDimensions" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Charged Dimensions</Label>
                                                <Field
                                                    as={Input}
                                                    name="ChargedDimensions"
                                                    value={values.ChargedDimensions}
                                                    onChange={(e: any) => setFieldValue('ChargedDimensions', e.target.value)}
                                                />
                                                <ErrorMessage name="ChargedDimensions" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Unit of Weight</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="UnitWeight"
                                                        options={renderOptions(options.UnitWeight, 'UnitWeight')}
                                                        placeholder="Select Unit"
                                                        value={values.UnitWeight}
                                                        onChange={(val: string) => setFieldValue('UnitWeight', val)}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="UnitWeight" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Actual Weight</Label>
                                                <Field
                                                    as={Input}
                                                    name="ActualWeight"
                                                    value={values.ActualWeight}
                                                    onChange={(e: any) => setFieldValue('ActualWeight', e.target.value)}
                                                />
                                                <ErrorMessage name="ActualWeight" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Charged Weight</Label>
                                                <Field
                                                    as={Input}
                                                    name="ChargedWeight"
                                                    value={values.ChargedWeight}
                                                    onChange={(e: any) => setFieldValue('ChargedWeight', e.target.value)}
                                                />
                                                <ErrorMessage name="ChargedWeight" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                           
                                            <div>
                                                <Label>Driver</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="Driver"
                                                        options={renderOptions(options.Driver, 'Driver')}
                                                        placeholder="Select Driver"
                                                        value={values.Driver}
                                                        onChange={(val: string) => {
                                                            if (val === '+Add new') {
                                                                driverModal.openModal();
                                                            } else {
                                                              setFieldValue('Driver', val);
                                                            }
                                                          }}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="Driver" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Vehicle</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="Vehicle"
                                                        options={renderOptions(options.Vehicle, 'Vehicle')}
                                                        placeholder="Select Vehicle"
                                                        value={values.Vehicle}
                                                        onChange={(val: string) => {
                                                            if (val === '+Add new') {
                                                                vehicleModal.openModal();
                                                            } else {
                                                                setFieldValue('Vehicle', val);
                                                            }
                                                          }}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="Vehicle" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Service Type</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="ServiceType"
                                                        options={renderOptions(options.ServiceType, 'ServiceType')}
                                                        placeholder="Select Service Type"
                                                        value={values.ServiceType}
                                                        onChange={(val: string) => setFieldValue('ServiceType', val)}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="ServiceType" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div>
                                                <Label>Provider</Label>
                                                <div className="relative">
                                                    <Field
                                                        as={Select}
                                                        name="Provider"
                                                        options={renderOptions(options.Provider, 'Provider')}
                                                        placeholder="Select Provider Type"
                                                        value={values.Provider}
                                                        onChange={(val: string) => setFieldValue('Provider', val)}
                                                    />
                                                    <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                        <ChevronDownIcon />
                                                    </span>
                                                </div>
                                                <ErrorMessage name="Provider" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            {/* Agency Dropdown */}
                                            {values.Provider === 'Agency' && (
                                                 <div>
                                                 <Label>Agency</Label>
                                                 <div className="relative">
                                                     <Field
                                                         as={Select}
                                                         name="Agency"
                                                         options={renderOptions(options.Agent, 'Agent')}
                                                         placeholder="Select Agency"
                                                         value={values.Agency}
                                                         onChange={(val: string) => {
                                                            if (val === '+Add new') {
                                                                agentModal.openModal();
                                                            } else {
                                                              setFieldValue('Agency', val);
                                                            }
                                                          }}
                                                     />
                                                     <span className="absolute text-gray-500 dark:text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                         <ChevronDownIcon />
                                                     </span>
                                                 </div>
                                                 <ErrorMessage name="Agency" component="p" className="text-red-500 text-xs mt-1" />
                                             </div>
                                            ) }
                                            <div>
                                                <Label>Eway Bill Number</Label>
                                                <Field
                                                    as={Input}
                                                    name="EwayBill"
                                                    value={values.EwayBill}
                                                    onChange={(e: any) => setFieldValue('EwayBill', e.target.value)}
                                                />
                                                <ErrorMessage name="EwayBill" component="p" className="text-red-500 text-xs mt-1" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Special Instructions</Label>
                                            <Field
                                                as={TextArea}
                                                name="Instructions"
                                                value={values.Instructions}
                                                onChange={(val: string) => setFieldValue('Instructions', val)}
                                                rows={10}
                                            />
                                            <ErrorMessage name="Instructions" component="p" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                disabled={isSubmitting}
                                                onClick={() => handleSubmit()}
                                                className={`bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {shipmentId ? 'Update Shipment' : 'Book Shipment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Preview Section */}
                                <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                                    <h2 className="flex justify-center font-semibold text-lg mb-4 text-gray-800 dark:text-white">Preview</h2>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                                        {Object.entries(values).map(([key, value]) => {
                                            const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                                            let displayValue = value;
                                            if (["Consigner", "Consignee", "Driver", "Vehicle"].includes(key)) {
                                                displayValue = getSelectedOptionLabel(String(value), key);
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
                                    {!Object.values(values).some(value => value) && (
                                        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Fill in the form to see preview</p>
                                    )}
                                </div>
                            </div>
                            {/* Modals */}
                            <SlideModal title='Add Consigner' isOpen={consignerModal.isOpen} onClose={consignerModal.closeModal}>
                                <EditConsigner onSave={(data: Consigner) => handleAddNewAndClose('Consigner', data, setFieldValue)} onCancel={() => consignerModal.closeModal()} />
                            </SlideModal>
                            <SlideModal title='Add Consignee' isOpen={consigneeModal.isOpen} onClose={consigneeModal.closeModal}>
                                <EditConsignee onSave={(data: Consignee) => handleAddNewAndClose('Consignee', data, setFieldValue)} onCancel={() => consigneeModal.closeModal()} />
                            </SlideModal>
                            <SlideModal title='Add Driver' isOpen={driverModal.isOpen} onClose={driverModal.closeModal}>
                                <EditDriver onSave={(data: Driver) => handleAddNewAndClose('Driver', data, setFieldValue)} onCancel={() => driverModal.closeModal()} />
                            </SlideModal>
                            <SlideModal title='Add Vehicle' isOpen={vehicleModal.isOpen} onClose={vehicleModal.closeModal}>
                                <EditVehicle onSave={(data: Vehicle) => handleAddNewAndClose('Vehicle', data, setFieldValue)} onCancel={() => vehicleModal.closeModal()} />
                            </SlideModal>
                             <SlideModal title='Add Agent' isOpen={agentModal.isOpen} onClose={agentModal.closeModal}>
                                <EditAgent onSave={(data: Agent) => handleAddNewAndClose('Agent', data, setFieldValue)} onCancel={() => agentModal.closeModal()}/>
                            </SlideModal>
                        </div>
                    )}
                </Formik>
            </div>
        </ComponentCard>
    );
};

export default EditShipment;
