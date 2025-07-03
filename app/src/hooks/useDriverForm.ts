import { useState } from 'react';
import { createDriver } from '@/utils/api/driverApi';
import { Driver } from '@/types/driver';

const useDriverForm = (onSave: any) => {
    const [newOptionValue, setNewOptionValue] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setNewOptionValue('');
        setFormData({});
    };

    const handleChange = (e: any) => {
        const { name, value, files, type: inputType } = e.target;
        if (inputType === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        console.log('Form data updated:', { ...formData, [name]: value });
    };

    const handleNameChange = (e: any) => {
        const value = e.target.value;
        setNewOptionValue(value);
        console.log('Name field updated:', value);
    };

    const handleSave = async () => {
        setError('');
        if (!newOptionValue) {
            setError('Driver Name is required');
         //   return;
        }
        setLoading(true);
        try {
            // Create FormData to match backend expectation
            const formDataToSend = new FormData();
            formDataToSend.append('name', newOptionValue);
            formDataToSend.append('contact[phone]', formData.contactNumber || '');
            formDataToSend.append('license_number', formData.licenseNumber || '');
            formDataToSend.append('address[adddress_line_1]', formData.address || '');
            formDataToSend.append('address[city]', formData.city || '');
            if (formData.licenseFile) {
                formDataToSend.append('licenseFile', formData.licenseFile);
            }

            console.log('Driver FormData payload:', formDataToSend);
            const response = await createDriver(formDataToSend);
            if (response) {
                onSave(response.data);
                resetForm();
            } else {
                setError('Error saving Driver');
            }
        } catch (err) {
            setError('Error saving driver');
        } finally {
            setLoading(false);
        }
    };

    return {
        newOptionValue,
        formData,
        loading,
        error,
        handleChange,
        handleNameChange,
        handleSave,
        resetForm,
    };
};

export default useDriverForm; 