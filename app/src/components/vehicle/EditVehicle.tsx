'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createVehicle, getVehicleById, updateVehicle } from '@/utils/api/vehicleApi';
import { Vehicle } from '@/types/vehicle';
import { vehicleSchema } from '@/validations/validationSchema';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import BtnSubmit from '../ui/button/BtnSubmit';
import { toast } from 'react-toastify';
import Label from '../form/Label';



interface EditVehicleProps {
    onSave: (data: Vehicle) => void;
    selectedId?: string | null;
    onCancel: () => void;
}

const EditVehicle: React.FC<EditVehicleProps> = ({ onSave, onCancel, selectedId }) => {
    const [initialValues, setInitialValues] = useState({
        vehicle_number: '',
        vehicle_type: '',
        capacity_weight: '',
        capacity_volume: '',
        rc_number: '',
        rc_file: '',
    });
    const resetForm = () => {
        // Reset to initial values if no selectedId
        setInitialValues({
            vehicle_number: '',
            vehicle_type: '',
            capacity_weight: '',
            capacity_volume: '',
            rc_number: '',
            rc_file: '',
        });
    }
    useEffect(() => {
        const fetchVehicle = async () => {
            if (selectedId) {
                try {
                    const res = await getVehicleById(selectedId);
                    const data = res.data;
                    setInitialValues({
                        vehicle_number: data.vehicle_number,
                        vehicle_type: data.vehicle_type || '',
                        capacity_weight: data.capacity_weight,
                        capacity_volume: data.capacity_volume,
                        rc_number: data.rc_number,
                        rc_file: data.rc_file,
                    });
                } catch (err) {
                    console.error('Error fetching vehicle:', err);
                }
            } else {
                resetForm();
            }
        };
        fetchVehicle();
    }, [selectedId]);

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        try {
            const formData = new FormData();
            formData.append('vehicle_number', values.vehicle_number || '');
            formData.append('vehicle_type', values.vehicle_type || '');
            formData.append('capacity_weight', values.capacity_weight || '');
            formData.append('capacity_volume', values.capacity_volume || '');
            formData.append('rc_number', values.rc_number || '');
            if (values.rc_file && values.rc_file as any instanceof File) {
                formData.append('rc_file', values.rc_file); // 🔥 rcFile key used for file upload
            }

            const res = selectedId ? await updateVehicle(selectedId, formData) : await createVehicle(formData);
            toast.success(`Vehicle ${selectedId ? 'updated' : 'created'} successfully!`);
            onSave(res.data);
            resetForm();
        } catch (error) {
            console.error('Failed to save vehicle:', error);
        } finally {
            setSubmitting(false);
        }
    };
    const handleCancel = () => {
        resetForm();
        onCancel();
    };


    return (
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={vehicleSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* VEHICLE FIELDS START */}

                        <div>
                            <Label htmlFor="vehicle_number">Vehicle Number</Label>
                            <Field id="vehicle_number" name="vehicle_number" as={Input} />
                            <ErrorMessage name="vehicle_number" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <Label htmlFor="vehicle_type">Vehicle Type</Label>
                            <Field id="vehicle_type" name="vehicle_type" as={Input} />
                            <ErrorMessage name="vehicle_type" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <Label htmlFor="capacity_weight">Capacity (Weight in Kg)</Label>
                            <Field id="capacity_weight" name="capacity_weight" as={Input} />
                            <ErrorMessage name="capacity_weight" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <Label htmlFor="capacity_volume">Capacity (Volume in m³)</Label>
                            <Field id="capacity_volume" name="capacity_volume" as={Input} />
                            <ErrorMessage name="capacity_volume" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <Label htmlFor="rc_number">RC Number</Label>
                            <Field id="rc_number" name="rc_number" as={Input} />
                            <ErrorMessage name="rc_number" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <Label htmlFor="rc_file">RC File Upload</Label>
                            <Input
                                id="rc_file"
                                name="rc_file"
                                type="file"
                                onChange={(event) => {
                                    setFieldValue('rc_file', event.currentTarget.files?.[0]);
                                }}
                            />
                            <ErrorMessage name="rc_file" component="div" className="text-red-500 text-sm" />

                            {initialValues.rc_file && typeof initialValues.rc_file === 'string' && (
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="mr-2">Existing RC File:</span>
                                    <a
                                        href={initialValues.rc_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        View / Download
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* VEHICLE FIELDS END */}


                        {/* Add fields for address if needed */}
                        {/* For example: */}
                        {/*
          <div>
            <Label htmlFor="address.street">Street</Label>
            <Field id="address.street" name="address.street" as={Input} />
            <ErrorMessage name="address.street" component="div" className="text-red-500 text-sm" />
          </div>
          */}

                        <div className="col-span-1 md:col-span-2 mt-4 gap-4 flex justify-end">
                            <BtnSubmit
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </BtnSubmit>

                            <Button variant='outline' onClick={handleCancel}>Cancel</Button>

                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditVehicle; 