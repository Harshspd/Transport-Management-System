'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createConsigner, getConsignerById, updateConsigner } from '@/utils/api/consignerApi';
import { Consigner } from '@/types/consigner';
import { consignerSchema } from '@/validations/validationSchema';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import Button from '../ui/button/Button';
import BtnSubmit from '../ui/button/BtnSubmit';
import { toast } from 'react-toastify';



interface EditConsignerProps {
    onSave: (data: Consigner) => void;
    selectedId?: string | null;
    onCancel: () => void;
}

const EditConsigner: React.FC<EditConsignerProps> = ({ onSave,onCancel, selectedId }) => {
    const [initialValues, setInitialValues] = useState({
        name: '',
        contactPerson: '',
        contactNumber: '',
        adddress_line_1: '',
        city: '',
        state: '',
        gstin: '',
    });
    const resetForm = () => {
        // Reset to initial values if no selectedId
        setInitialValues({
            name: '',
            contactPerson: '',
            contactNumber: '',
            adddress_line_1: '',
            city: '',
            state: '',
            gstin: '',
        });
    }
    useEffect(() => {
        const fetchConsigner = async () => {
            if (selectedId) {
                try {
                    const res = await getConsignerById(selectedId);
                    const data = res.data;
                    setInitialValues({
                        name: data.name || '',
                        contactPerson: data.contact?.person || '',
                        contactNumber: data.contact?.phone || '',
                        adddress_line_1: data.address?.adddress_line_1 || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        gstin: data.gstin || '',
                    });
                } catch (err) {
                    console.error('Error fetching consigner:', err);
                }
            } else {
                resetForm();
            }
        };
        fetchConsigner();
    }, [selectedId]);

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        try {
            const payload: Consigner = {
                name: values.name,
                contact: {
                    person: values.contactPerson,
                    phone: values.contactNumber,
                },
                address: {
                    adddress_line_1: values.adddress_line_1,
                    city: values.city,
                    state: values.state,
                },
                gstin: values.gstin,
            };

            const res = selectedId ? await updateConsigner(selectedId, payload) : await createConsigner(payload);
            toast.success(`Consigner ${selectedId ? 'updated' : 'created'} successfully!`);
            onSave(res.data);
            resetForm();
        } catch (error) {
            console.error('Failed to save consigner:', error);
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
                    validationSchema={consignerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label>Consigner Name</label>
                                    <Field name="name" as={Input} />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label>Address</label>
                                    <Field name="adddress_line_1" id="adddress_line_1" rows={5} className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden" />
                                    <ErrorMessage name="adddress_line_1" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label>City</label>
                                    <Field name="city" as={Input} />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label>Contact Person</label>
                                    <Field name="contactPerson" as={Input} />
                                    <ErrorMessage name="contactPerson" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label>Contact Number</label>
                                    <Field name="contactNumber" as={Input} />
                                    <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label>GSTIN</label>
                                    <Field name="gstin" as={Input} />
                                    <ErrorMessage name="gstin" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <label>State</label>
                                    <Field name="state" as={Input} />
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                </div>

                                
                            </div>

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

export default EditConsigner; 