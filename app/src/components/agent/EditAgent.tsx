'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { createAgent, getAgentById, updateAgent } from '@/utils/api/agentApi';
import { Agent } from '@/types/agent';
import { agentSchema } from '@/validations/validationSchema';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import BtnSubmit from '../ui/button/BtnSubmit';
import { toast } from 'react-toastify';
import Label from '../form/Label';



interface EditAgentProps {
    onSave: (data: Agent) => void;
    selectedId?: string | null;
    onCancel: () => void;
}

const EditAgent: React.FC<EditAgentProps> = ({ onSave, onCancel, selectedId }) => {
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
        const fetchAgent = async () => {
            if (selectedId) {
                try {
                    const res = await getAgentById(selectedId);
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
                    console.error('Error fetching agent:', err);
                }
            } else {
                resetForm();
            }
        };
        fetchAgent();
    }, [selectedId]);

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        try {
            const payload: Agent = {
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

            const res = selectedId ? await updateAgent(selectedId, payload) : await createAgent(payload);
            toast.success(`Agent ${selectedId ? 'updated' : 'created'} successfully!`);
            onSave(res.data);
            resetForm();
        } catch (error) {
            console.error('Failed to save agent:', error);
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
                    validationSchema={agentSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label>Agent Name</Label>
                                    <Field name="name" as={Input} />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label>Address</Label>
                                    <Field name="adddress_line_1" id="adddress_line_1" rows={5} className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden" />
                                    <ErrorMessage name="adddress_line_1" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label>City</Label>
                                    <Field name="city" as={Input} />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label>Contact Person</Label>
                                    <Field name="contactPerson" as={Input} />
                                    <ErrorMessage name="contactPerson" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label>Contact Number</Label>
                                    <Field name="contactNumber" as={Input} />
                                    <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label>GSTIN</Label>
                                    <Field name="gstin" as={Input} />
                                    <ErrorMessage name="gstin" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label>State</Label>
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
                        </form>
                    )}
                </Formik>
            </div>
    );
};

export default EditAgent; 