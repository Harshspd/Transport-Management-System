'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createDriver, getDriverById, updateDriver } from '@/utils/api/driverApi';
import { Driver } from '@/types/driver';
import { driverSchema } from '@/validations/validationSchema';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import Button from '../ui/button/Button';
import BtnSubmit from '../ui/button/BtnSubmit';
import { toast } from 'react-toastify';



interface EditDriverProps {
    onSave: (data: Driver) => void;
    selectedId?: string | null;
    onCancel: () => void;
}

const EditDriver: React.FC<EditDriverProps> = ({ onSave, onCancel, selectedId }) => {
    const [initialValues, setInitialValues] = useState({
        name: '',
        contact: {
            person: '',
            phone: '',
        },
        address: {
            street: '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
        },
        license_number: '',
        license_file: '',
    });
    const resetForm = () => {
        // Reset to initial values if no selectedId
        setInitialValues({
            name: '',
            contact: {
                person: '',
                phone: '',
            },
            address: {
                street: '',
                city: '',
                state: '',
                zip_code: '',
                country: '',
            },
            license_number: '',
            license_file: '',

        });
    }
    useEffect(() => {
        const fetchDriver = async () => {
            if (selectedId) {
                try {
                    const res = await getDriverById(selectedId);
                    const data = res.data;
                    setInitialValues({
                        name: data.name,
                        contact: {
                            person: data.contact.person || '',
                            phone: data.contact.phone || '',
                        },
                        address: {
                            street: data.address.street || '',
                            city: data.address.city || '',
                            state: data.address.state || '',
                            zip_code: '',
                            country: '',
                        },
                        license_number: data?.license_number || '',
                        license_file: data.license_file,
                    });
                } catch (err) {
                    console.error('Error fetching driver:', err);
                }
            } else {
                resetForm();
            }
        };
        fetchDriver();
    }, [selectedId]);

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('address.street', values?.address?.street)
            formData.append('address.city', values?.address?.city)
            formData.append('address.state', values?.address?.state)
            formData.append('contact.person', values.contact.person);
            formData.append('contact.phone', values.contact.phone);
            formData.append('license_number', values.license_number);
            if (values.license_file && values.license_file as any instanceof File) {
                formData.append('licenseFile', values.license_file);
            }

            const res = selectedId ? await updateDriver(selectedId, formData) : await createDriver(formData);
            toast.success(`Driver ${selectedId ? 'updated' : 'created'} successfully!`);
            onSave(res.data);
            resetForm();
        } catch (error) {
            console.error('Failed to save driver:', error);
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
                validationSchema={driverSchema}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col gap-4">
                            <label htmlFor="name">Driver Name</label>
                            <Field id="name" name="name" as={Input} />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="contact.person">Contact Person (Optional)</label>
                            <Field id="contact.person" name="contact.person" as={Input} />
                            <ErrorMessage name="contact.person" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="contact.phone">Contact Phone</label>
                            <Field id="contact.phone" name="contact.phone" as={Input} />
                            <ErrorMessage name="contact.phone" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div>
                            <label>Address</label>
                            <Field name="address.street" id="address.street" rows={5} className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden" />
                            <ErrorMessage name="address.street" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label>City</label>
                            <Field name="address.city" as={Input} />
                            <ErrorMessage name="address.city" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="license_number">License Number (Optional)</label>
                            <Field id="license_number" name="license_number" as={Input} />
                            <ErrorMessage name="license_number" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="license_file">License File Upload (Optional)</label>
                            <Input
                                id="license_file"
                                name="license_file"
                                type="file"
                                onChange={(event) => {
                                    setFieldValue('license_file', event.currentTarget.files?.[0]);
                                }}
                            />
                            <ErrorMessage name="license_file" component="div" className="text-red-500 text-sm" />
                            {initialValues.license_file && typeof initialValues.license_file === 'string' && (
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className="mr-2">Existing License File:</span>
                                <a
                                    href={initialValues.license_file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    View / Download
                                </a>
                                </div>
                            )}
                        </div>

                        {/* Add fields for address if needed */}
                        {/* For example: */}
                        {/*
          <div>
            <label htmlFor="address.street">Street</label>
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

export default EditDriver; 